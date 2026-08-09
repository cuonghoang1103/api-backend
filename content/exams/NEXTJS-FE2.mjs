/**
 * Next.js & React — Final Exam 2 (FE-2): 50 câu trắc nghiệm phủ cả 20 chương.
 *
 * Đề tự soạn, bám sát `content/courses/nextjs/s01…s20`, khác câu với FE-1. Mọi
 * đoạn JSX/JS hỏi "in ra gì" đều đã CHẠY THẬT (react-dom/server / node).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NEXTJS-FE2.mjs --apply
 */
import { B, EX, code, mcq } from './_lib/nextjs-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all 20 chapters. Some show code and ask what it renders or prints; those outputs came from running the snippet. A few say "choose TWO" and need both. The timer auto-submits; explanations are bilingual.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả 20 chương. Một số câu cho mã và hỏi nó render/in ra gì; các kết quả đó lấy từ việc chạy thật. Vài câu ghi "chọn HAI" và cần đủ cả hai. Hết giờ tự nộp; lời giải song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'nextjs' },
  exams: [
    {
      kind: 'FE',
      code: 'FE-2',
      source: 'SAMPLE',
      sortOrder: 5,
      title: B(
        'Final Exam 2 — the whole Next.js & React course (50 questions)',
        'Thi cuối khoá 2 — toàn bộ khoá Next.js & React (50 câu)',
      ),
      description: B(
        'A second full-course final: JSX and rendering, components, state, effects, hooks, keys, the App Router, Server/Client Components, caching, routing, Server Actions, styling, state management, auth, forms, SEO, performance, testing and deploy — different questions from Final Exam 1.',
        'Đề cuối khoá thứ hai phủ toàn khoá: JSX và render, component, state, effect, hooks, key, App Router, Server/Client Component, cache, định tuyến, Server Actions, giao diện, quản lý state, xác thực, form, SEO, hiệu năng, kiểm thử và deploy — câu khác với Thi cuối khoá 1.',
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
            'What does this print?' + code('console.log(JSON.stringify(["", "0", "5"].map(v => v || "def")));'),
            'Đoạn này in ra gì?' + code('console.log(JSON.stringify(["", "0", "5"].map(v => v || "def")));'),
          ),
          options: [
            B('["def","0","5"]', '["def","0","5"]'),
            B('["def","def","5"]', '["def","def","5"]'),
            B('["","0","5"]', '["","0","5"]'),
            B('["def","def","def"]', '["def","def","def"]'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>||</code> falls back on any falsy value: the empty string is falsy → "def", but the string <code>"0"</code> is truthy (a non-empty string) → kept. This is why <code>||</code> is risky for defaults where an empty/zero-ish value is valid.',
            'Đã chạy thật. <code>||</code> thay bằng giá trị dự phòng với mọi giá trị falsy: chuỗi rỗng là falsy → "def", nhưng chuỗi <code>"0"</code> là truthy (chuỗi khác rỗng) → giữ nguyên. Vì thế <code>||</code> nguy hiểm cho giá trị mặc định khi một giá trị rỗng/gần-0 vẫn hợp lệ.',
          ),
        }),
        mcq({
          prompt: B(
            'What renders?' + code('return <p>{null}{undefined}{"text"}{false}</p>;'),
            'Cái gì được render?' + code('return <p>{null}{undefined}{"text"}{false}</p>;'),
          ),
          options: [
            B('&lt;p&gt;text&lt;/p&gt;', '&lt;p&gt;text&lt;/p&gt;'),
            B('&lt;p&gt;nullundefinedtextfalse&lt;/p&gt;', '&lt;p&gt;nullundefinedtextfalse&lt;/p&gt;'),
            B('&lt;p&gt;textfalse&lt;/p&gt;', '&lt;p&gt;textfalse&lt;/p&gt;'),
            B('&lt;p&gt;&lt;/p&gt;', '&lt;p&gt;&lt;/p&gt;'),
          ],
          correct: 0,
          explanation: EX(
            'Verified with renderToStaticMarkup. React skips <code>null</code>, <code>undefined</code>, and booleans when rendering — only the string "text" shows. This is why <code>{cond &amp;&amp; ...}</code> is safe (renders nothing when false), unlike a number.',
            'Đã kiểm bằng renderToStaticMarkup. React bỏ qua <code>null</code>, <code>undefined</code>, và boolean khi render — chỉ chuỗi "text" hiện. Vì thế <code>{cond &amp;&amp; ...}</code> an toàn (không render gì khi false), khác với một con số.',
          ),
        }),
        mcq({
          prompt: B(
            'Which attribute is written correctly in JSX?',
            'Thuộc tính nào viết đúng trong JSX?',
          ),
          options: [
            B('onClick and htmlFor', 'onClick và htmlFor'),
            B('onclick and for', 'onclick và for'),
            B('OnClick and For', 'OnClick và For'),
            B('on-click and html-for', 'on-click và html-for'),
          ],
          correct: 0,
          explanation: EX(
            'JSX uses camelCase event names (<code>onClick</code>) and the DOM property names <code>className</code>/<code>htmlFor</code> (because <code>class</code>/<code>for</code> are reserved words). Lowercase <code>onclick</code>/<code>for</code> are the HTML spellings, not JSX.',
            'JSX dùng tên sự kiện camelCase (<code>onClick</code>) và tên thuộc tính DOM <code>className</code>/<code>htmlFor</code> (vì <code>class</code>/<code>for</code> là từ khoá dành riêng). <code>onclick</code>/<code>for</code> viết thường là cách viết của HTML, không phải JSX.',
          ),
        }),
        // Ch2
        mcq({
          prompt: B(
            'What is <code>{a}</code> and <code>{b}</code>?' + code('const { a = 1, b = 2 } = { a: 5 };'),
            '<code>{a}</code> và <code>{b}</code> là gì?' + code('const { a = 1, b = 2 } = { a: 5 };'),
          ),
          options: [
            B('a is 5, b is 2', 'a là 5, b là 2'),
            B('a is 1, b is 2', 'a là 1, b là 2'),
            B('a is 5, b is undefined', 'a là 5, b là undefined'),
            B('a is 1, b is 5', 'a là 1, b là 5'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. A destructuring default applies only when the value is <code>undefined</code>. <code>a</code> is provided (5) so the default is ignored; <code>b</code> is missing so it takes 2. This is exactly how default props work.',
            'Đã chạy thật. Giá trị mặc định khi phân rã chỉ áp dụng khi giá trị là <code>undefined</code>. <code>a</code> được cung cấp (5) nên bỏ mặc định; <code>b</code> thiếu nên lấy 2. Đây đúng là cách prop mặc định hoạt động.',
          ),
        }),
        mcq({
          prompt: B(
            'A layout component that renders <code>{children}</code> in a styled shell is an example of…',
            'Một component layout render <code>{children}</code> trong một lớp vỏ có style là ví dụ của…',
          ),
          options: [
            B('Composition', 'Ghép nối (composition)'),
            B('Inheritance', 'Kế thừa (inheritance)'),
            B('Mutation', 'Mutation'),
            B('Memoization', 'Memoization'),
          ],
          correct: 0,
          explanation: EX(
            'React favours composition: a wrapper renders whatever it is given via <code>children</code>, instead of a subclass extending a base component. This is more flexible than inheritance and is the standard pattern for cards, modals, and layouts.',
            'React ưa ghép nối: một component bọc render bất cứ thứ gì được đưa vào qua <code>children</code>, thay vì một lớp con kế thừa một component gốc. Cách này linh hoạt hơn kế thừa và là mẫu chuẩn cho card, modal, và layout.',
          ),
        }),
        mcq({
          prompt: B(
            'Why should rendering avoid mutating a prop or an outer variable?',
            'Vì sao render nên tránh mutate một prop hoặc một biến bên ngoài?',
          ),
          options: [
            B('Rendering must be pure so React can re-run it safely', 'Render phải thuần để React chạy lại an toàn'),
            B('Mutation is illegal in JavaScript strict mode', 'Mutation là bất hợp pháp trong strict mode của JavaScript'),
            B('Props are frozen and throw on write', 'Props bị đóng băng và ném lỗi khi ghi'),
            B('It slows the garbage collector', 'Nó làm chậm bộ dọn rác'),
          ],
          correct: 0,
          explanation: EX(
            'React may call your component multiple times and in different orders; a pure render (no side effects, no mutation) guarantees the same output for the same inputs. Mutating during render produces bugs React cannot track. Do side effects in handlers/effects.',
            'React có thể gọi component của bạn nhiều lần và theo thứ tự khác nhau; một render thuần (không hiệu ứng phụ, không mutate) bảo đảm cùng kết quả với cùng đầu vào. Mutate lúc render sinh lỗi React không lần ra. Hãy làm hiệu ứng phụ trong handler/effect.',
          ),
        }),
        // Ch3
        mcq({
          prompt: B(
            'What does this print?' + code('console.log(JSON.stringify([undefined, 0, null].map(v => v ?? "def")));'),
            'Đoạn này in ra gì?' + code('console.log(JSON.stringify([undefined, 0, null].map(v => v ?? "def")));'),
          ),
          options: [
            B('["def",0,"def"]', '["def",0,"def"]'),
            B('["def","def","def"]', '["def","def","def"]'),
            B('[null,0,null]', '[null,0,null]'),
            B('["def",0,null]', '["def",0,null]'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>??</code> only falls back on <code>null</code>/<code>undefined</code>, so <code>0</code> is kept (unlike <code>||</code>). Use <code>??</code> when zero or empty string are valid values you must not overwrite.',
            'Đã chạy thật. <code>??</code> chỉ thay khi giá trị là <code>null</code>/<code>undefined</code>, nên <code>0</code> được giữ (khác <code>||</code>). Dùng <code>??</code> khi số 0 hay chuỗi rỗng là giá trị hợp lệ không được ghi đè.',
          ),
        }),
        mcq({
          prompt: B(
            'To remove an item from an array in state, immutably, use…',
            'Để xoá một phần tử khỏi mảng trong state một cách bất biến, dùng…',
          ),
          options: [
            B('setItems(items.filter(x => x.id !== id))', 'setItems(items.filter(x => x.id !== id))'),
            B('items.splice(index, 1) then setItems(items)', 'items.splice(index, 1) rồi setItems(items)'),
            B('delete items[index] then setItems(items)', 'delete items[index] rồi setItems(items)'),
            B('items.pop() then setItems(items)', 'items.pop() rồi setItems(items)'),
          ],
          correct: 0,
          explanation: EX(
            '<code>filter</code> returns a new array, which React can compare by reference and re-render. <code>splice</code>/<code>pop</code>/<code>delete</code> mutate the existing array (same reference), so React may skip the update and leaves holes.',
            '<code>filter</code> trả về một mảng mới, React so sánh theo tham chiếu và render lại được. <code>splice</code>/<code>pop</code>/<code>delete</code> sửa ngay mảng cũ (cùng tham chiếu), nên React có thể bỏ qua cập nhật và để lại lỗ hổng.',
          ),
        }),
        mcq({
          prompt: B(
            'Why does <code>setState</code> not update the variable synchronously on the next line?',
            'Vì sao <code>setState</code> không cập nhật biến ngay ở dòng kế tiếp?',
          ),
          options: [
            B('State is a snapshot for the current render; the new value appears on the next render', 'State là ảnh chụp của lần render hiện tại; giá trị mới xuất hiện ở lần render sau'),
            B('setState is always asynchronous over the network', 'setState luôn bất đồng bộ qua mạng'),
            B('The variable is a constant that cannot change', 'Biến là hằng số nên không đổi được'),
            B('React batches only class components', 'React chỉ gộp cập nhật cho class component'),
          ],
          correct: 0,
          explanation: EX(
            'The state variable is fixed for the duration of the current render (a snapshot). Calling the setter schedules a re-render with the new value; reading the same variable right after still shows the old value. That is by design, not a network delay.',
            'Biến state cố định suốt lần render hiện tại (một ảnh chụp). Gọi setter lên lịch render lại với giá trị mới; đọc lại chính biến đó ngay sau vẫn thấy giá trị cũ. Đó là thiết kế, không phải độ trễ mạng.',
          ),
        }),
        // Ch4
        mcq({
          prompt: B(
            'To read whether a checkbox is checked in <code>onChange</code>, use…',
            'Để đọc một checkbox có đang được tích không trong <code>onChange</code>, dùng…',
          ),
          options: [
            B('e.target.checked', 'e.target.checked'),
            B('e.target.value', 'e.target.value'),
            B('e.checked', 'e.checked'),
            B('e.target.selected', 'e.target.selected'),
          ],
          correct: 0,
          explanation: EX(
            'A checkbox reports its state via <code>e.target.checked</code> (a boolean). <code>e.target.value</code> is the checkbox&#x27;s <code>value</code> attribute, not whether it is checked. For text inputs you use <code>value</code>.',
            'Một checkbox báo trạng thái qua <code>e.target.checked</code> (một boolean). <code>e.target.value</code> là thuộc tính <code>value</code> của checkbox, không phải nó có được tích hay không. Với ô văn bản thì bạn dùng <code>value</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'A form submit reloads the page unexpectedly. The fix in the handler is…',
            'Một lần submit form tải lại trang ngoài ý muốn. Cách sửa trong handler là…',
          ),
          options: [
            B('Call e.preventDefault()', 'Gọi e.preventDefault()'),
            B('Call e.stopPropagation()', 'Gọi e.stopPropagation()'),
            B('return true', 'return true'),
            B('Remove the onSubmit handler', 'Bỏ handler onSubmit'),
          ],
          correct: 0,
          explanation: EX(
            'The browser&#x27;s default for a form submit is a navigation/reload; <code>e.preventDefault()</code> cancels it so JS handles the submit. <code>stopPropagation</code> only stops bubbling; <code>return true</code> does nothing here.',
            'Mặc định của trình duyệt khi submit form là điều hướng/tải lại; <code>e.preventDefault()</code> huỷ nó để JS xử lý. <code>stopPropagation</code> chỉ chặn nổi bọt; <code>return true</code> ở đây vô tác dụng.',
          ),
        }),
        // Ch5
        mcq({
          prompt: B(
            'An effect fetches when <code>userId</code> changes. Which dependency array is correct?',
            'Một effect tải dữ liệu khi <code>userId</code> đổi. Mảng dependency nào đúng?',
          ),
          options: [
            B('[userId]', '[userId]'),
            B('[]', '[]'),
            B('No array', 'Không có mảng'),
            B('[fetchData]', '[fetchData]'),
          ],
          correct: 0,
          explanation: EX(
            'List every reactive value the effect reads: here <code>userId</code>. With <code>[]</code> it never refetches on change; with no array it runs every render; <code>[fetchData]</code> depends on an unstable function unless memoized. Add cleanup to ignore stale responses.',
            'Hãy liệt kê mọi giá trị phản ứng mà effect đọc: ở đây là <code>userId</code>. Với <code>[]</code> nó không tải lại khi đổi; không có mảng thì chạy mỗi lần render; <code>[fetchData]</code> phụ thuộc một hàm không ổn định trừ khi đã memo. Thêm dọn dẹp để bỏ qua phản hồi cũ.',
          ),
        }),
        mcq({
          prompt: B(
            'You add an event listener to <code>window</code> in an effect. What must the cleanup do?',
            'Bạn thêm một listener sự kiện vào <code>window</code> trong một effect. Hàm dọn dẹp phải làm gì?',
          ),
          options: [
            B('removeEventListener with the same function reference', 'removeEventListener với đúng tham chiếu hàm đó'),
            B('Set the listener variable to null on cleanup', 'Đặt biến listener thành null khi dọn dẹp'),
            B('Call window.location.reload() on cleanup', 'Gọi window.location.reload() khi dọn dẹp'),
            B('Nothing is needed — React removes it for you', 'Không cần gì — React tự gỡ giúp bạn'),
          ],
          correct: 0,
          explanation: EX(
            'You must remove the exact handler you added (<code>window.removeEventListener("resize", handler)</code>). Using a different/inline function fails to detach it, leaking listeners that stack up on every re-run.',
            'Bạn phải gỡ đúng handler đã thêm (<code>window.removeEventListener("resize", handler)</code>). Dùng một hàm khác/inline sẽ không gỡ được, gây rò rỉ listener chồng lên nhau ở mỗi lần chạy lại.',
          ),
        }),
        mcq({
          prompt: B(
            'An effect that only sets up a subscription and cleans it up should have which dependency array, assuming it reads nothing reactive?',
            'Một effect chỉ thiết lập một subscription rồi dọn dẹp, giả sử không đọc giá trị phản ứng nào, nên có mảng dependency nào?',
          ),
          options: [
            B('[]', '[]'),
            B('No array at all', 'Không có mảng nào'),
            B('[Date.now()]', '[Date.now()]'),
            B('[Math.random()]', '[Math.random()]'),
          ],
          correct: 0,
          explanation: EX(
            'If it reads no reactive value, <code>[]</code> sets up once on mount and cleans up at unmount. No array reruns it every render (wasteful/buggy); a changing value like <code>Date.now()</code> reruns constantly.',
            'Nếu không đọc giá trị phản ứng nào, <code>[]</code> thiết lập một lần lúc mount và dọn dẹp lúc gỡ. Không có mảng thì chạy lại mỗi render (lãng phí/lỗi); một giá trị đổi liên tục như <code>Date.now()</code> làm nó chạy lại không ngừng.',
          ),
        }),
        // Ch6
        mcq({
          prompt: B(
            'When does <code>useCallback(fn, [a])</code> return a new function reference?',
            'Khi nào <code>useCallback(fn, [a])</code> trả về một tham chiếu hàm mới?',
          ),
          options: [
            B('Only when a changes', 'Chỉ khi a đổi'),
            B('On every render', 'Ở mọi lần render'),
            B('Never after the first render', 'Không bao giờ sau lần render đầu'),
            B('Only in StrictMode', 'Chỉ trong StrictMode'),
          ],
          correct: 0,
          explanation: EX(
            '<code>useCallback</code> memoizes the function and returns the same reference until a dependency changes — here, only when <code>a</code> changes. That stable reference is what lets a <code>React.memo</code> child skip re-renders.',
            '<code>useCallback</code> memo hoá hàm và trả về cùng tham chiếu cho tới khi một dependency đổi — ở đây chỉ khi <code>a</code> đổi. Tham chiếu ổn định đó là thứ giúp một con <code>React.memo</code> bỏ qua render lại.',
          ),
        }),
        mcq({
          prompt: B(
            'A reducer function must be…',
            'Một hàm reducer phải là…',
          ),
          options: [
            B('Pure — compute the next state from state and action, no side effects', 'Thuần — tính state kế tiếp từ state và action, không hiệu ứng phụ'),
            B('Async, so it can await the database inside', 'Bất đồng bộ, để nó await cơ sở dữ liệu bên trong'),
            B('A React component that returns JSX', 'Một component React trả về JSX'),
            B('A method defined on the store class', 'Một phương thức định nghĩa trên class store'),
          ],
          correct: 0,
          explanation: EX(
            'A reducer is a pure <code>(state, action) =&gt; newState</code> function: no I/O, no mutation, deterministic. Side effects (fetches, logging) happen outside — in the dispatcher, an effect, or a Server Action.',
            'Một reducer là hàm thuần <code>(state, action) =&gt; newState</code>: không I/O, không mutate, tất định. Hiệu ứng phụ (fetch, ghi log) diễn ra bên ngoài — ở nơi dispatch, một effect, hay một Server Action.',
          ),
        }),
        // Ch7
        mcq({
          prompt: B(
            'What does this render?' + code("return <ul>{[{id:'a'},{id:'b'}].map(o => <li key={o.id}>{o.id}</li>)}</ul>;"),
            'Đoạn này render ra gì?' + code("return <ul>{[{id:'a'},{id:'b'}].map(o => <li key={o.id}>{o.id}</li>)}</ul>;"),
          ),
          options: [
            B('&lt;ul&gt;&lt;li&gt;a&lt;/li&gt;&lt;li&gt;b&lt;/li&gt;&lt;/ul&gt;', '&lt;ul&gt;&lt;li&gt;a&lt;/li&gt;&lt;li&gt;b&lt;/li&gt;&lt;/ul&gt;'),
            B('&lt;ul&gt;&lt;li key="a"&gt;a&lt;/li&gt;…&lt;/ul&gt;', '&lt;ul&gt;&lt;li key="a"&gt;a&lt;/li&gt;…&lt;/ul&gt;'),
            B('&lt;ul&gt;ab&lt;/ul&gt;', '&lt;ul&gt;ab&lt;/ul&gt;'),
            B('&lt;ul&gt;&lt;/ul&gt;', '&lt;ul&gt;&lt;/ul&gt;'),
          ],
          correct: 0,
          explanation: EX(
            'Verified with renderToStaticMarkup. <code>key</code> is used by React for reconciliation only — it does NOT appear in the DOM output. So you get plain <code>&lt;li&gt;a&lt;/li&gt;&lt;li&gt;b&lt;/li&gt;</code>.',
            'Đã kiểm bằng renderToStaticMarkup. <code>key</code> chỉ được React dùng cho reconciliation — nó KHÔNG xuất hiện trong DOM. Nên bạn nhận được <code>&lt;li&gt;a&lt;/li&gt;&lt;li&gt;b&lt;/li&gt;</code> thuần.',
          ),
        }),
        mcq({
          prompt: B(
            'Changing a component&#x27;s <code>key</code> from one value to another causes React to…',
            'Đổi <code>key</code> của một component từ giá trị này sang giá trị khác khiến React…',
          ),
          options: [
            B('Unmount the old instance and mount a fresh one (state resets)', 'Gỡ thể hiện cũ và mount một cái mới (state được đặt lại)'),
            B('Keep the same instance and its state', 'Giữ nguyên thể hiện và state của nó'),
            B('Throw a duplicate-key error', 'Ném lỗi key trùng'),
            B('Only update the DOM attributes', 'Chỉ cập nhật các thuộc tính DOM'),
          ],
          correct: 0,
          explanation: EX(
            'A different key means "a different element" at that position, so React discards the old subtree and mounts new — resetting all internal state. This is the idiomatic <code>key={id}</code> trick to reset a form when the selected entity changes.',
            'Một key khác nghĩa là "một phần tử khác" ở vị trí đó, nên React bỏ cây con cũ và mount cái mới — đặt lại toàn bộ state nội bộ. Đây là mẹo <code>key={id}</code> quen thuộc để đặt lại một form khi thực thể được chọn đổi.',
          ),
        }),
        // Ch8
        mcq({
          prompt: B(
            'A folder <code>_components</code> (leading underscore) under <code>app/</code> is…',
            'Một thư mục <code>_components</code> (gạch dưới ở đầu) trong <code>app/</code> là…',
          ),
          options: [
            B('A private folder that is not routable', 'Một thư mục riêng, không định tuyến'),
            B('A route group', 'Một route group'),
            B('A dynamic segment', 'Một đoạn động'),
            B('A parallel route slot', 'Một khe parallel route'),
          ],
          correct: 0,
          explanation: EX(
            'A leading underscore opts a folder out of routing — useful for colocating components/helpers inside <code>app/</code> without creating URLs. Parentheses <code>(group)</code> make a route group (no URL segment); brackets <code>[x]</code> make a dynamic segment.',
            'Gạch dưới ở đầu đưa một thư mục ra khỏi định tuyến — tiện để đặt component/helper ngay trong <code>app/</code> mà không tạo URL. Ngoặc đơn <code>(group)</code> tạo route group (không thêm đoạn URL); ngoặc vuông <code>[x]</code> tạo đoạn động.',
          ),
        }),
        mcq({
          prompt: B(
            'A nested <code>layout.tsx</code> composes with its parent layout by…',
            'Một <code>layout.tsx</code> lồng ghép với layout cha bằng cách…',
          ),
          options: [
            B('Rendering inside the parent&#x27;s {children} slot', 'Được render bên trong khe {children} của cha'),
            B('Replacing the parent layout entirely', 'Thay thế hoàn toàn layout cha'),
            B('Running only on the client', 'Chỉ chạy trên client'),
            B('Being ignored unless it is the root', 'Bị bỏ qua trừ khi là gốc'),
          ],
          correct: 0,
          explanation: EX(
            'Layouts nest: the root layout wraps a section layout, which wraps the page — each renders its subtree via <code>{children}</code>. Navigating within a shared layout preserves it (and its state) without remounting.',
            'Layout lồng nhau: root layout bọc layout của một mảng, layout đó bọc trang — mỗi cái render cây con của mình qua <code>{children}</code>. Điều hướng trong một layout dùng chung sẽ giữ nó (và state) mà không remount.',
          ),
        }),
        mcq({
          prompt: B(
            'A dynamic route <code>app/product/[id]/page.tsx</code> reads the id from…',
            'Một route động <code>app/product/[id]/page.tsx</code> đọc id từ…',
          ),
          options: [
            B('The params prop the page receives', 'Prop params mà trang nhận được'),
            B('process.argv', 'process.argv'),
            B('A global router object', 'Một object router toàn cục'),
            B('The document title', 'Tiêu đề tài liệu'),
          ],
          correct: 0,
          explanation: EX(
            'The server page receives <code>{ params }</code> (recent Next: a Promise you await), with <code>params.id</code> holding the segment value. In a Client Component you can also use the <code>useParams</code> hook.',
            'Trang server nhận <code>{ params }</code> (Next gần đây: một Promise cần await), với <code>params.id</code> chứa giá trị đoạn. Trong Client Component bạn cũng có thể dùng hook <code>useParams</code>.',
          ),
        }),
        // Ch9
        mcq({
          prompt: B(
            'Which can a Server Component do that a Client Component cannot?',
            'Điều gì Server Component làm được mà Client Component không?',
          ),
          options: [
            B('await a database query directly in the component body', 'await một truy vấn cơ sở dữ liệu ngay trong thân component'),
            B('Use useState for local state', 'Dùng useState cho state cục bộ'),
            B('Attach an onClick handler', 'Gắn một handler onClick'),
            B('Use the useEffect hook', 'Dùng hook useEffect'),
          ],
          correct: 0,
          explanation: EX(
            'Server Components run on the server and can be <code>async</code>, so they <code>await</code> data (DB, files, APIs) directly and keep credentials server-side. Interactivity and browser hooks (<code>useState</code>, <code>useEffect</code>, <code>onClick</code>) require a Client Component.',
            'Server Component chạy trên server và có thể <code>async</code>, nên <code>await</code> dữ liệu (DB, file, API) trực tiếp và giữ thông tin đăng nhập ở server. Tính tương tác và hook trình duyệt (<code>useState</code>, <code>useEffect</code>, <code>onClick</code>) cần Client Component.',
          ),
        }),
        mcq({
          prompt: B(
            'Adding <code>"use client"</code> to a component means…',
            'Thêm <code>"use client"</code> vào một component nghĩa là…',
          ),
          options: [
            B('It and its imported tree ship to and run in the browser', 'Nó và cây import của nó được gửi xuống và chạy trong trình duyệt'),
            B('It can no longer receive props', 'Nó không còn nhận được props'),
            B('It renders only on the server', 'Nó chỉ render trên server'),
            B('It disables hydration', 'Nó tắt hydration'),
          ],
          correct: 0,
          explanation: EX(
            '<code>"use client"</code> marks the boundary: that component (and modules it imports) become part of the client bundle and hydrate in the browser, enabling state and events. It can still be rendered by a Server parent and receive serializable props.',
            '<code>"use client"</code> đánh dấu ranh giới: component đó (và các module nó import) trở thành một phần của bundle client và hydrate trong trình duyệt, cho phép state và sự kiện. Nó vẫn được một cha Server render và nhận prop tuần tự hoá được.',
          ),
        }),
        mcq({
          prompt: B(
            'A secret API key used only for fetching should live in…',
            'Một API key bí mật chỉ dùng để tải dữ liệu nên nằm ở…',
          ),
          options: [
            B('A Server Component or server-side code, never in a Client Component', 'Một Server Component hoặc mã phía server, không bao giờ trong Client Component'),
            B('A NEXT_PUBLIC_ variable read by the client', 'Một biến NEXT_PUBLIC_ được client đọc'),
            B('The Client Component that renders the fetched data', 'Client Component render dữ liệu đã tải đó'),
            B('The browser&#x27;s localStorage on the client', 'localStorage của trình duyệt phía client'),
          ],
          correct: 0,
          explanation: EX(
            'Server Component code never ships to the browser, so a key used there stays secret. Anything in a Client Component or a <code>NEXT_PUBLIC_</code> var is in the bundle for anyone to read. Fetch with the key on the server (or a Route Handler proxy).',
            'Mã Server Component không bao giờ gửi xuống trình duyệt, nên một key dùng ở đó vẫn bí mật. Bất cứ thứ gì trong Client Component hay biến <code>NEXT_PUBLIC_</code> đều nằm trong bundle cho ai cũng đọc. Hãy fetch bằng key ở server (hoặc một proxy Route Handler).',
          ),
        }),
        // Ch10
        mcq({
          prompt: B(
            'To cache a fetch and refresh it at most every 5 minutes, use…',
            'Để cache một fetch và làm mới tối đa mỗi 5 phút, dùng…',
          ),
          options: [
            B('fetch(url, { next: { revalidate: 300 } })', 'fetch(url, { next: { revalidate: 300 } })'),
            B('fetch(url, { cache: "no-store" })', 'fetch(url, { cache: "no-store" })'),
            B('fetch(url, { next: { ttl: 300 } })', 'fetch(url, { next: { ttl: 300 } })'),
            B('fetch(url, { revalidate: "5m" })', 'fetch(url, { revalidate: "5m" })'),
          ],
          correct: 0,
          explanation: EX(
            '<code>next: { revalidate: 300 }</code> caches the result and regenerates it in the background after 300 seconds (ISR). <code>no-store</code> disables caching; <code>ttl</code> and the <code>"5m"</code> string are not the API.',
            '<code>next: { revalidate: 300 }</code> cache kết quả và tái tạo nền sau 300 giây (ISR). <code>no-store</code> tắt cache; <code>ttl</code> và chuỗi <code>"5m"</code> không phải API.',
          ),
        }),
        mcq({
          prompt: B(
            'Two Server Components fetch the same URL in one render. Next…',
            'Hai Server Component fetch cùng một URL trong một lần render. Next…',
          ),
          options: [
            B('Deduplicates the fetch so the request runs once', 'Gộp fetch lại nên request chỉ chạy một lần'),
            B('Runs both requests and hopes they match', 'Chạy cả hai request và mong chúng khớp'),
            B('Throws a duplicate-request error', 'Ném lỗi request trùng'),
            B('Caches only the second one', 'Chỉ cache request thứ hai'),
          ],
          correct: 0,
          explanation: EX(
            'Next (via React) memoizes identical <code>fetch</code> calls within a single render pass, so shared data can be fetched wherever it is needed without duplicate network calls. This is request memoization, distinct from the persistent data cache.',
            'Next (qua React) memo hoá các lời <code>fetch</code> giống nhau trong một lượt render, nên dữ liệu dùng chung có thể được fetch ở bất cứ đâu cần mà không gọi mạng trùng. Đây là request memoization, khác với data cache bền.',
          ),
        }),
        mcq({
          prompt: B(
            'Which makes a route dynamically rendered per request? (choose TWO)',
            'Điều nào khiến một route render động theo từng request? (chọn HAI)',
          ),
          options: [
            B('Calling cookies() or headers()', 'Gọi cookies() hoặc headers()'),
            B('Reading searchParams', 'Đọc searchParams'),
            B('Importing a UI component', 'Import một component giao diện'),
            B('Using Tailwind classes', 'Dùng class Tailwind'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Both reading request-specific data — <code>cookies()</code>/<code>headers()</code> and <code>searchParams</code> — force dynamic rendering, since the output depends on the request. Importing components or using CSS classes has no effect on static/dynamic.',
            'Cả việc đọc dữ liệu riêng-request — <code>cookies()</code>/<code>headers()</code> và <code>searchParams</code> — đều ép render động, vì kết quả phụ thuộc request. Import component hay dùng class CSS không ảnh hưởng tĩnh/động.',
          ),
        }),
        // Ch11
        mcq({
          prompt: B(
            'A Route Handler returns JSON with…',
            'Một Route Handler trả về JSON bằng…',
          ),
          options: [
            B('return Response.json(data)', 'return Response.json(data)'),
            B('res.json(data)', 'res.json(data)'),
            B('return data', 'return data'),
            B('export default data', 'export default data'),
          ],
          correct: 0,
          explanation: EX(
            'App Router handlers use the Web <code>Response</code> API: <code>return Response.json(data)</code> (or <code>new Response(...)</code>). There is no Express-style <code>res</code> object; returning a raw value or default-exporting data is not how handlers respond.',
            'Handler của App Router dùng Web <code>Response</code> API: <code>return Response.json(data)</code> (hoặc <code>new Response(...)</code>). Không có object <code>res</code> kiểu Express; trả về giá trị thô hay export default dữ liệu không phải cách handler phản hồi.',
          ),
        }),
        mcq({
          prompt: B(
            'The "modal on navigation, full page on hard load" UX uses…',
            'Trải nghiệm "modal khi điều hướng, trang đầy đủ khi tải thẳng" dùng…',
          ),
          options: [
            B('Parallel routes with intercepting routes', 'Parallel route kết hợp intercepting route'),
            B('A single Server Action', 'Một Server Action duy nhất'),
            B('Only CSS position: fixed', 'Chỉ CSS position: fixed'),
            B('middleware rewrites only', 'Chỉ viết lại trong middleware'),
          ],
          correct: 0,
          explanation: EX(
            'An intercepting route catches an in-app link and renders the target inside a parallel <code>@modal</code> slot over the current page; a direct/hard load of the same URL shows the standalone page. One URL, two presentations.',
            'Một intercepting route bắt một link trong ứng dụng và render đích trong một slot song song <code>@modal</code> đè lên trang hiện tại; tải thẳng chính URL đó thì hiện trang độc lập. Một URL, hai cách trình bày.',
          ),
        }),
        // Ch12
        mcq({
          prompt: B(
            'Why must a Server Action validate its inputs on the server?',
            'Vì sao một Server Action phải kiểm tra dữ liệu vào của nó trên server?',
          ),
          options: [
            B('It is a public endpoint anyone can call, not just your form', 'Nó là endpoint công khai ai cũng gọi được, không chỉ form của bạn'),
            B('Client validation is impossible', 'Kiểm phía client là không thể'),
            B('The database refuses unvalidated data', 'Cơ sở dữ liệu từ chối dữ liệu chưa kiểm'),
            B('TypeScript validates it at runtime', 'TypeScript kiểm nó lúc chạy'),
          ],
          correct: 0,
          explanation: EX(
            'Next exposes Server Actions as callable server endpoints, so a client can post arbitrary data directly. Always validate/parse on the server (e.g. Zod). Client checks are for UX; TypeScript types vanish at runtime.',
            'Next để lộ Server Action như các endpoint server gọi được, nên client có thể POST dữ liệu bất kỳ trực tiếp. Hãy luôn kiểm/parse trên server (ví dụ Zod). Kiểm phía client chỉ để trải nghiệm; kiểu TypeScript biến mất lúc chạy.',
          ),
        }),
        mcq({
          prompt: B(
            'To show a pending state on a form&#x27;s submit button, use…',
            'Để hiện trạng thái đang chờ trên nút submit của form, dùng…',
          ),
          options: [
            B('useFormStatus from react-dom', 'useFormStatus từ react-dom'),
            B('useState with a manual flag only', 'Chỉ useState với một cờ thủ công'),
            B('useEffect polling', 'useEffect thăm dò'),
            B('useRef on the button', 'useRef trên nút'),
          ],
          correct: 0,
          explanation: EX(
            '<code>useFormStatus</code> (from <code>react-dom</code>) reads the <code>pending</code> state of the enclosing form action, so a submit button can disable/spin automatically. A manual flag works too but is more code and easy to desync.',
            '<code>useFormStatus</code> (từ <code>react-dom</code>) đọc trạng thái <code>pending</code> của form action bao quanh, nên nút submit có thể tự vô hiệu/xoay. Một cờ thủ công cũng được nhưng dài dòng và dễ lệch.',
          ),
        }),
        mcq({
          prompt: B(
            '<code>useOptimistic</code> is used to…',
            '<code>useOptimistic</code> dùng để…',
          ),
          options: [
            B('Show an expected result instantly, then reconcile with the server', 'Hiện kết quả kỳ vọng tức thì, rồi hoà hợp với server'),
            B('Cache server data and share it across pages', 'Cache dữ liệu server và chia sẻ qua các trang'),
            B('Validate a form&#x27;s fields on the client', 'Kiểm các trường của một form phía client'),
            B('Debounce a text input as the user types', 'Debounce một ô nhập khi người dùng gõ'),
          ],
          correct: 0,
          explanation: EX(
            '<code>useOptimistic</code> renders an optimistic value (e.g. like count +1) while a Server Action is in flight, then replaces it with the real result — reverting automatically on failure. It makes action-driven UIs feel instant.',
            '<code>useOptimistic</code> render một giá trị lạc quan (ví dụ số thích +1) trong khi Server Action đang chạy, rồi thay bằng kết quả thật — tự hoàn tác khi thất bại. Nó làm UI dựa trên action có cảm giác tức thì.',
          ),
        }),
        // Ch13
        mcq({
          prompt: B(
            'Tailwind keeps the shipped CSS small by…',
            'Tailwind giữ CSS gửi đi nhỏ gọn bằng cách…',
          ),
          options: [
            B('Scanning your files and emitting only the classes you use', 'Quét file của bạn và chỉ phát ra các class bạn dùng'),
            B('Shipping the entire framework CSS', 'Gửi toàn bộ CSS của framework'),
            B('Inlining styles as attributes', 'Nội tuyến style thành thuộc tính'),
            B('Compiling to a single class', 'Biên dịch thành một class duy nhất'),
          ],
          correct: 0,
          explanation: EX(
            'Tailwind&#x27;s build scans your source for class names and generates only those utilities, so unused classes never ship. This "purge/JIT" step is why a huge utility system results in a tiny production stylesheet.',
            'Bước build của Tailwind quét mã nguồn tìm tên class và chỉ sinh ra những tiện ích đó, nên class không dùng không bao giờ được gửi. Bước "purge/JIT" này là lý do một hệ tiện ích khổng lồ lại cho ra một stylesheet production tí hon.',
          ),
        }),
        mcq({
          prompt: B(
            'A theme-dependent color that must work in both themes is best set with…',
            'Một màu phụ thuộc theme cần chạy đúng ở cả hai theme nên được đặt tốt nhất bằng…',
          ),
          options: [
            B('A CSS variable (e.g. var(--text-primary)) that each theme redefines', 'Một biến CSS (ví dụ var(--text-primary)) mà mỗi theme định nghĩa lại'),
            B('A hardcoded hex value on the element', 'Một giá trị hex gán cứng trên phần tử'),
            B('A global Tailwind dark: utility on html', 'Một tiện ích dark: của Tailwind toàn cục trên html'),
            B('An inline style object computed in JavaScript', 'Một object style inline tính trong JavaScript'),
          ],
          correct: 0,
          explanation: EX(
            'A CSS variable redefined per theme (via <code>html.theme-dark ...</code>) lets one rule adapt to light/dark. A hardcoded hex ignores the theme; a global <code>dark:</code> utility on cuongthai.com is reserved for the Notes wrapper, not global styles.',
            'Một biến CSS được định nghĩa lại theo từng theme (qua <code>html.theme-dark ...</code>) cho phép một luật thích ứng sáng/tối. Một hex gán cứng bỏ qua theme; một tiện ích <code>dark:</code> toàn cục trên cuongthai.com dành riêng cho vỏ Notes, không phải style toàn cục.',
          ),
        }),
        // Ch14
        mcq({
          prompt: B(
            'Persisting a Zustand store to localStorage can cause a first-paint flash because…',
            'Lưu một store Zustand vào localStorage có thể gây nháy chớp ở lần vẽ đầu vì…',
          ),
          options: [
            B('The saved value is read on the client after the initial render', 'Giá trị đã lưu được đọc ở client sau lần render đầu'),
            B('localStorage is encrypted', 'localStorage bị mã hoá'),
            B('The server reads localStorage too late', 'Server đọc localStorage quá trễ'),
            B('Zustand cannot persist', 'Zustand không lưu được'),
          ],
          correct: 0,
          explanation: EX(
            'The server (and first client render) uses the default state; <code>localStorage</code> is only available on the client and rehydrates shortly after mount, so the persisted value pops in slightly later. Guard UI that depends on it until rehydration completes.',
            'Server (và lần render client đầu) dùng state mặc định; <code>localStorage</code> chỉ có ở client và nạp lại ngay sau mount, nên giá trị đã lưu hiện ra hơi trễ. Hãy chặn phần UI phụ thuộc nó cho tới khi nạp lại xong.',
          ),
        }),
        mcq({
          prompt: B(
            'Prop-drilling a value through five layers that do not use it suggests you should…',
            'Khoan một giá trị qua năm tầng không dùng đến nó gợi ý bạn nên…',
          ),
          options: [
            B('Use Context or a store for that shared value', 'Dùng Context hoặc một store cho giá trị dùng chung đó'),
            B('Add more props', 'Thêm nhiều prop hơn'),
            B('Store it in a global window variable', 'Lưu nó vào một biến window toàn cục'),
            B('Fetch it again in each layer', 'Fetch lại nó ở từng tầng'),
          ],
          correct: 0,
          explanation: EX(
            'When many intermediate components must forward a prop they never use, Context (for low-frequency globals like theme/user) or a store (Zustand, for shared mutable state) removes the plumbing. A window global bypasses React&#x27;s render cycle.',
            'Khi nhiều component trung gian phải chuyển tiếp một prop chúng không dùng, Context (cho các giá trị toàn cục ít đổi như theme/user) hoặc một store (Zustand, cho state chia sẻ có thể đổi) loại bỏ phần đi dây. Một biến window toàn cục đi vòng qua vòng render của React.',
          ),
        }),
        // Ch15
        mcq({
          prompt: B(
            'On the server, you read a cookie with…',
            'Trên server, bạn đọc một cookie bằng…',
          ),
          options: [
            B('cookies() from next/headers', 'cookies() từ next/headers'),
            B('document.cookie', 'document.cookie'),
            B('req.cookies in a Server Component', 'req.cookies trong một Server Component'),
            B('useCookies()', 'useCookies()'),
          ],
          correct: 0,
          explanation: EX(
            'There is no <code>document</code> on the server; use <code>cookies()</code> from <code>next/headers</code> in Server Components, Route Handlers and Server Actions. Reading a cookie makes the route dynamic.',
            'Trên server không có <code>document</code>; hãy dùng <code>cookies()</code> từ <code>next/headers</code> trong Server Component, Route Handler và Server Action. Đọc một cookie làm route trở nên động.',
          ),
        }),
        mcq({
          prompt: B(
            'A JWT access token should generally be…',
            'Một access token JWT nói chung nên…',
          ),
          options: [
            B('Short-lived, paired with a refresh mechanism', 'Sống ngắn, đi kèm một cơ chế refresh'),
            B('Long-lived with no refresh, to avoid complexity', 'Sống dài không refresh, để tránh phức tạp'),
            B('Stored in a NEXT_PUBLIC_ variable', 'Lưu trong một biến NEXT_PUBLIC_'),
            B('Logged for debugging', 'Ghi log để gỡ lỗi'),
          ],
          correct: 0,
          explanation: EX(
            'Short-lived access tokens limit the damage if leaked; a refresh flow keeps sessions alive without a long-lived token. The cuongthai.com bug was a 24h token with NO refresh under a 7-day cookie, so sessions silently 401&#x27;d.',
            'Access token sống ngắn giới hạn thiệt hại nếu lộ; một luồng refresh giữ phiên sống mà không cần token sống dài. Lỗi cuongthai.com là token 24 giờ KHÔNG refresh dưới một cookie 7 ngày, nên phiên âm thầm bị 401.',
          ),
        }),
        mcq({
          prompt: B(
            'A quick, unauth <code>curl</code> to <code>/api/v1/x</code> returns 401. That means the route is…',
            'Một <code>curl</code> nhanh, không auth tới <code>/api/v1/x</code> trả 401. Nghĩa là route…',
          ),
          options: [
            B('Mounted but requires authentication', 'Đã mount nhưng cần xác thực'),
            B('Not mounted (stale build)', 'Chưa mount (build cũ)'),
            B('Public and healthy', 'Công khai và khoẻ mạnh'),
            B('Permanently broken', 'Hỏng vĩnh viễn'),
          ],
          correct: 0,
          explanation: EX(
            'For diagnosing route health: <b>401</b> = mounted, needs auth; <b>200</b> = mounted, public; <b>404</b> = NOT mounted (a stale/partial build). This is exactly how cuongthai.com&#x27;s deploy smoke-test decides success.',
            'Để chẩn đoán sức khoẻ route: <b>401</b> = đã mount, cần auth; <b>200</b> = đã mount, công khai; <b>404</b> = CHƯA mount (build cũ/dở). Đây đúng là cách smoke-test khi deploy của cuongthai.com quyết định thành công.',
          ),
        }),
        // Ch16
        mcq({
          prompt: B(
            'React Hook Form + Zod validate a form by…',
            'React Hook Form + Zod kiểm tra một form bằng cách…',
          ),
          options: [
            B('Passing a zodResolver so the schema drives validation', 'Truyền một zodResolver để schema điều khiển việc kiểm tra'),
            B('Manually checking each field in onSubmit', 'Kiểm tay từng trường trong onSubmit'),
            B('Only validating on the server', 'Chỉ kiểm trên server'),
            B('Using regex in the JSX', 'Dùng regex trong JSX'),
          ],
          correct: 0,
          explanation: EX(
            'You wire the schema in with <code>@hookform/resolvers/zod</code> (<code>resolver: zodResolver(schema)</code>); RHF then validates fields against the Zod schema and surfaces errors, while <code>z.infer</code> gives you the matching types. Still re-validate on the server for Server Actions.',
            'Bạn nối schema bằng <code>@hookform/resolvers/zod</code> (<code>resolver: zodResolver(schema)</code>); RHF sau đó kiểm các trường theo schema Zod và hiện lỗi, còn <code>z.infer</code> cho bạn kiểu khớp. Vẫn phải kiểm lại trên server cho Server Action.',
          ),
        }),
        mcq({
          prompt: B(
            'An optimistic upload preview uses a <code>blob:</code> URL. <code>getMediaUrl</code> should…',
            'Một bản xem trước upload lạc quan dùng một URL <code>blob:</code>. <code>getMediaUrl</code> nên…',
          ),
          options: [
            B('Return it unchanged (it is already renderable)', 'Trả về nó nguyên vẹn (nó đã render được)'),
            B('Prepend the CDN base to it', 'Ghép base CDN vào nó'),
            B('Convert it to a storage key', 'Đổi nó thành một key kho lưu trữ'),
            B('Reject it as invalid', 'Từ chối nó vì không hợp lệ'),
          ],
          correct: 0,
          explanation: EX(
            'A <code>blob:</code>/<code>data:</code> URL is already a complete, renderable URL. Prepending the CDN base produces <code>https://cdn/blob:...</code> which 400s — a real cuongthai.com bug. Only bare storage keys get the CDN base.',
            'Một URL <code>blob:</code>/<code>data:</code> đã là một URL đầy đủ, render được. Ghép base CDN vào tạo ra <code>https://cdn/blob:...</code> gây lỗi 400 — một lỗi thật của cuongthai.com. Chỉ key kho trần mới được ghép base CDN.',
          ),
        }),
        // Ch17
        mcq({
          prompt: B(
            'ISR (Incremental Static Regeneration) is essentially…',
            'ISR (tái tạo tĩnh tăng dần) về bản chất là…',
          ),
          options: [
            B('SSG plus periodic background revalidation', 'SSG cộng làm mới nền định kỳ'),
            B('SSR on every request', 'SSR ở mọi request'),
            B('Client-side rendering only', 'Chỉ render phía client'),
            B('Disabling all caching', 'Tắt toàn bộ cache'),
          ],
          correct: 0,
          explanation: EX(
            'ISR serves a statically generated page from cache and regenerates it in the background after a <code>revalidate</code> interval, giving static speed with periodic freshness — no full rebuild or per-request SSR needed.',
            'ISR phục vụ một trang dựng tĩnh từ cache và tái tạo nền sau một khoảng <code>revalidate</code>, cho tốc độ tĩnh mà vẫn tươi định kỳ — không cần build lại toàn bộ hay SSR theo từng request.',
          ),
        }),
        mcq({
          prompt: B(
            'A social share preview looks wrong because the OG tags are set on the client. The fix is…',
            'Một bản xem trước chia sẻ mạng xã hội bị sai vì thẻ OG được đặt ở client. Cách sửa là…',
          ),
          options: [
            B('Render the metadata on the server via the Metadata API', 'Render metadata trên server qua Metadata API'),
            B('Add the tags in a useEffect', 'Thêm các thẻ trong một useEffect'),
            B('Set them with document.head.append', 'Đặt chúng bằng document.head.append'),
            B('Put them in a Client Component', 'Đặt chúng trong một Client Component'),
          ],
          correct: 0,
          explanation: EX(
            'Crawlers read the server-rendered HTML head and usually do not run JS, so OG tags must be produced server-side via <code>metadata</code>/<code>generateMetadata</code>. Client-set tags arrive too late for the crawler.',
            'Trình thu thập đọc phần head của HTML render trên server và thường không chạy JS, nên thẻ OG phải được sinh ở server qua <code>metadata</code>/<code>generateMetadata</code>. Thẻ đặt ở client tới quá trễ với trình thu thập.',
          ),
        }),
        // Ch18
        mcq({
          prompt: B(
            '<code>next/dynamic</code> with <code>{ ssr: false }</code> is useful for…',
            '<code>next/dynamic</code> với <code>{ ssr: false }</code> hữu ích cho…',
          ),
          options: [
            B('A client-only widget (e.g. one using window) loaded on demand', 'Một widget chỉ chạy client (ví dụ dùng window) tải theo nhu cầu'),
            B('Making a Server Component render faster on the server', 'Làm một Server Component render nhanh hơn trên server'),
            B('Caching API responses on the client side', 'Cache phản hồi API ở phía client'),
            B('Adding SEO metadata to the page head', 'Thêm metadata SEO vào phần head của trang'),
          ],
          correct: 0,
          explanation: EX(
            'Dynamic import splits code so a heavy component loads on demand; <code>{ ssr: false }</code> additionally skips server rendering — right for widgets that need <code>window</code>/DOM (maps, editors) and would break during SSR.',
            'Dynamic import tách mã để một component nặng tải theo nhu cầu; <code>{ ssr: false }</code> còn bỏ qua render trên server — hợp cho widget cần <code>window</code>/DOM (bản đồ, trình soạn) vốn sẽ hỏng lúc SSR.',
          ),
        }),
        mcq({
          prompt: B(
            'The most reliable signal that a route&#x27;s bundle grew is…',
            'Tín hiệu đáng tin nhất cho thấy bundle của một route phình to là…',
          ),
          options: [
            B('The First Load JS in the next build output', 'Chỉ số First Load JS trong kết quả next build'),
            B('The number of components you wrote', 'Số component bạn đã viết'),
            B('The count of CSS classes', 'Số lượng class CSS'),
            B('The number of routes in the app', 'Số route trong ứng dụng'),
          ],
          correct: 0,
          explanation: EX(
            'Compare the per-route First Load JS across builds — that is the actual JavaScript shipped, including shared chunks. Component count or class count do not directly map to bundle size.',
            'Hãy so sánh First Load JS theo từng route qua các lần build — đó là JavaScript thật được gửi đi, gồm cả chunk dùng chung. Số component hay số class không ánh xạ trực tiếp tới kích thước bundle.',
          ),
        }),
        // Ch19
        mcq({
          prompt: B(
            'A test that renders a component and clicks a button by its accessible role is a…',
            'Một test render một component và bấm một nút theo vai trò accessible của nó là một…',
          ),
          options: [
            B('Component/integration test with React Testing Library', 'Test component/tích hợp với React Testing Library'),
            B('Pure unit test of a single function', 'Unit test thuần của một hàm đơn lẻ'),
            B('Load test measuring throughput', 'Test tải đo thông lượng'),
            B('Type check run by the compiler', 'Kiểm kiểu do trình biên dịch chạy'),
          ],
          correct: 0,
          explanation: EX(
            'Rendering a component and interacting via roles/text is exactly what RTL does — a component (integration) test of behaviour. A unit test targets a single function; a type check is <code>tsc</code>; a load test measures throughput.',
            'Render một component và tương tác qua vai trò/văn bản đúng là việc của RTL — một test component (tích hợp) về hành vi. Unit test nhắm một hàm đơn; kiểm kiểu là <code>tsc</code>; test tải đo thông lượng.',
          ),
        }),
        mcq({
          prompt: B(
            'Why did <code>tsc --noEmit</code> miss a seed break on cuongthai.com?',
            'Vì sao <code>tsc --noEmit</code> bỏ sót một lỗi seed trên cuongthai.com?',
          ),
          options: [
            B('tsconfig excluded prisma/**, and the seed had its own hand-copied types', 'tsconfig loại trừ prisma/**, và seed tự chép kiểu của riêng nó'),
            B('tsc is fundamentally broken and unreliable', 'tsc về căn bản bị hỏng và không đáng tin'),
            B('The seed file had no TypeScript at all', 'File seed hoàn toàn không có TypeScript'),
            B('Prisma silently disables all type checks', 'Prisma âm thầm tắt mọi kiểm kiểu'),
          ],
          correct: 0,
          explanation: EX(
            'The main tsconfig excluded <code>prisma/**</code>, so the seed was never type-checked; worse, it carried a hand-copied union so it agreed with itself. A dedicated <code>typecheck:seed</code> plus actually running the seed closes that hole.',
            'tsconfig chính loại trừ <code>prisma/**</code>, nên seed không bao giờ được kiểm kiểu; tệ hơn, nó tự chép một union nên tự khớp với chính mình. Một <code>typecheck:seed</code> riêng cộng việc chạy seed thật bịt lỗ đó.',
          ),
        }),
        // Ch20
        mcq({
          prompt: B(
            'Why proxy a third-party API (like GIPHY) through a backend route instead of calling it from the client?',
            'Vì sao nên proxy một API bên thứ ba (như GIPHY) qua một route backend thay vì gọi từ client?',
          ),
          options: [
            B('The key stays server-side, responses can be cached, and rotation is a restart', 'Key ở lại server, phản hồi cache được, và xoay key chỉ cần restart'),
            B('It is simply faster to type out the code', 'Đơn giản là gõ mã cho nhanh hơn'),
            B('The client cannot make any network requests', 'Client không thể gọi mạng gì cả'),
            B('Third-party APIs always require server rendering', 'API bên thứ ba luôn đòi render trên server'),
          ],
          correct: 0,
          explanation: EX(
            'A backend proxy (cuongthai.com&#x27;s <code>/api/v1/gifs</code>) keeps the key out of the browser bundle, lets you cache upstream responses, and rotates the key with a restart — no rebuild. The GIF picker broke exactly because the key was a <code>NEXT_PUBLIC_</code> var.',
            'Một proxy backend (như <code>/api/v1/gifs</code> của cuongthai.com) giữ key khỏi bundle trình duyệt, cho phép cache phản hồi thượng nguồn, và xoay key bằng một lần restart — không cần build lại. Bộ chọn GIF hỏng đúng vì key là một biến <code>NEXT_PUBLIC_</code>.',
          ),
        }),
        mcq({
          prompt: B(
            'A deploy smoke-test hits core GET routes and fails on a 404 because…',
            'Một smoke-test khi deploy gọi các route GET cốt lõi và thất bại khi gặp 404 vì…',
          ),
          options: [
            B('A 404 means the route is not mounted — a stale or partial build', 'Một 404 nghĩa là route chưa mount — build cũ hoặc dở'),
            B('404 is always a network error', '404 luôn là lỗi mạng'),
            B('404 means the database is down', '404 nghĩa là cơ sở dữ liệu sập'),
            B('404 means authentication failed', '404 nghĩa là xác thực thất bại'),
          ],
          correct: 0,
          explanation: EX(
            'On a healthy build, core routes return 200/401 (mounted). A 404 means the router never registered that route — a sign the container is running an old or partial image. Failing the deploy on 404 catches stale builds before they reach users.',
            'Trên một build khoẻ mạnh, các route cốt lõi trả 200/401 (đã mount). Một 404 nghĩa là router chưa đăng ký route đó — dấu hiệu container đang chạy một image cũ hoặc dở. Làm deploy thất bại khi gặp 404 bắt được build cũ trước khi nó tới người dùng.',
          ),
        }),
        mcq({
          prompt: B(
            'After a bad migration reaches production, reverting the code…',
            'Sau khi một migration sai lên tới production, revert mã…',
          ),
          options: [
            B('Does NOT revert the database — discuss a forward fix first', 'KHÔNG revert cơ sở dữ liệu — hãy bàn một bản vá tiến tới trước'),
            B('Automatically rolls back the schema', 'Tự động lùi schema'),
            B('Deletes the applied migration', 'Xoá migration đã áp'),
            B('Is done with git push --force', 'Được làm bằng git push --force'),
          ],
          correct: 0,
          explanation: EX(
            'Code and database are separate: reverting code does not undo an applied schema/data change, so the two can disagree. Discuss a forward fix or a compensating migration with a human; never force-push, and never edit a deployed migration.',
            'Mã và cơ sở dữ liệu là tách biệt: revert mã không hoàn tác một thay đổi schema/dữ liệu đã áp, nên hai bên có thể lệch. Hãy bàn một bản vá tiến tới hoặc một migration bù với con người; đừng bao giờ force-push, và đừng sửa một migration đã deploy.',
          ),
        }),
      ],
    },
  ],
};
