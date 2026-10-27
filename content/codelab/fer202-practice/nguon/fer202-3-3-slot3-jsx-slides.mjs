/**
 * FER202 · 3.3 — Slide check: Rendering with JSX (Slot 2–3 part 2). Trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-3-3-slot3-jsx-slides',
  ten: '3.3 Slide check — Rendering with JSX',
  khoa: KHOA,
  baiHoc: 'fer202-3-3-slot3-jsx-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: rendering with JSX',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['JSX', 'createElement', 'expressions', 'lists & keys', 'Fragment'], the: ['jsx', 'quiz'],
      moTa: {
        en: '<p>Ten questions on how JSX works and how React renders it. Most of them are "what appears on the screen?" — read the code carefully.</p>',
        vi: '<p>Mười câu về cách JSX hoạt động và React hiển thị nó. Phần lớn là "màn hình hiện gì?" — đọc kỹ mã.</p>',
      },
      goiY: ['Nhớ: JSX chỉ là cú pháp cho React.createElement(type, props, ...children).', 'React không vẽ false/null/undefined/true nhưng VẼ số 0 và chuỗi rỗng không hiện gì.'],
      loiHayGap: ['Nghĩ JSX là HTML: thuộc tính, sự kiện, style đều theo quy tắc JavaScript.', 'Quên rằng key không được truyền xuống như một prop đọc được.'],
      giaiThich: '<p>Giải thích từng câu hiện sau khi nộp; câu sai ⇒ xem lại bài 3.1–3.2.</p>',
      thuatNgu: [{ en: 'transpile', vi: 'biên dịch cú pháp mới sang JavaScript thường' }, { en: 'virtual DOM', vi: 'cây đối tượng mô tả giao diện trong bộ nhớ' }],
      cauHoi: [
        q('q1', '<code>&lt;h1 className="t"&gt;Hi&lt;/h1&gt;</code> compiles to…', [['a', "<code>React.createElement('h1', { className: 't' }, 'Hi')</code>"], ['b', "<code>document.createElement('h1')</code>"], ['c', 'An HTML string'], ['d', 'A template literal']], ['a'], 'JSX is syntax sugar for <code>React.createElement(type, props, ...children)</code>, which returns a plain object (a React element).|||JSX là cú pháp rút gọn cho React.createElement(type, props, ...children), trả về object thường (React element).'),
        q('q2', 'Which can you put inside <code>{ }</code> in JSX?', [['a', 'An <code>if</code> statement'], ['b', 'A <code>for</code> loop'], ['c', 'Any expression, e.g. <code>a ? b : c</code>'], ['d', 'A variable declaration']], ['c'], 'Only expressions (they produce a value). Statements go before the <code>return</code>.|||Chỉ biểu thức (ra giá trị). Câu lệnh đặt trước return.'),
        q('q3', 'What does <code>&lt;div&gt;{[1, 2, 3]}&lt;/div&gt;</code> show?', [['a', '1,2,3'], ['b', '123'], ['c', '[1, 2, 3]'], ['d', 'Nothing']], ['b'], 'Arrays are rendered item by item without separators.|||Mảng được vẽ từng phần tử, không có dấu phân cách.'),
        q('q4', 'What does <code>&lt;p&gt;{0 &amp;&amp; \'Items\'}&lt;/p&gt;</code> show?', [['a', 'Items'], ['b', '0'], ['c', 'Nothing'], ['d', 'false']], ['b'], '<code>0 &amp;&amp; x</code> is <code>0</code>, and React renders numbers. Use a boolean condition.|||0 && x là 0, và React vẽ số. Hãy dùng điều kiện boolean.'),
        q('q5', 'Why does a list item need a <code>key</code>?', [['a', 'For CSS styling'], ['b', 'So React can match items between renders'], ['c', 'It becomes the HTML id'], ['d', 'Keys are optional decoration']], ['b'], 'Keys identify elements across renders so React reuses the right DOM nodes and state.|||Key định danh phần tử giữa các lần render để React dùng lại đúng nút DOM và state.'),
        q('q6', 'Which keys are acceptable? (choose all)', [['a', 'A database id'], ['b', '<code>Math.random()</code>'], ['c', 'The index, for a static list that never changes'], ['d', 'A unique slug']], [['a', 'c', 'd']], 'Keys must be stable and unique among siblings. Random keys change every render and destroy state.|||Key phải ổn định và duy nhất giữa anh em. Key ngẫu nhiên đổi mỗi lần render và phá state.', true),
        q('q7', 'Why use <code>&lt;&gt; … &lt;/&gt;</code> instead of a <code>div</code>?', [['a', 'It renders faster CSS'], ['b', 'It groups children without adding a DOM node'], ['c', 'It is required by React 18'], ['d', 'It creates a new scope for variables']], ['b'], 'A Fragment groups elements without an extra wrapper — important inside tables, lists and flex/grid layouts.|||Fragment gom phần tử mà không thêm thẻ bọc — quan trọng trong bảng, danh sách, bố cục flex/grid.'),
        q('q8', 'Correct inline style in JSX?', [['a', '<code>style="color: red"</code>'], ['b', '<code>style={{ color: \'red\', fontSize: 16 }}</code>'], ['c', '<code>style={color: red}</code>'], ['d', '<code>css={{ color: red }}</code>']], ['b'], 'An object with camelCase keys inside an expression (hence the double braces).|||Một object khoá camelCase nằm trong biểu thức (nên có hai cặp ngoặc).'),
        q('q9', 'A comment inside JSX is written as…', [['a', '<code>&lt;!-- note --&gt;</code>'], ['b', '<code>// note</code>'], ['c', '<code>{/* note */}</code>'], ['d', '<code># note</code>']], ['c'], 'Comments are JavaScript, so they go inside braces: <code>{/* … */}</code>.|||Chú thích là JavaScript nên đặt trong ngoặc nhọn: {/* … */}.'),
        q('q10', 'User text <code>"&lt;script&gt;alert(1)&lt;/script&gt;"</code> rendered with <code>{text}</code>…', [['a', 'Runs the script'], ['b', 'Is shown as text (escaped)'], ['c', 'Crashes React'], ['d', 'Is removed']], ['b'], 'React escapes strings, protecting against XSS. Only <code>dangerouslySetInnerHTML</code> bypasses it.|||React escape chuỗi nên chống XSS. Chỉ dangerouslySetInnerHTML mới bỏ qua cơ chế này.'),
      ],
    }),
  ],
});
