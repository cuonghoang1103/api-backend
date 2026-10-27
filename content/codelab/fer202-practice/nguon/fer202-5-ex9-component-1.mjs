/**
 * FER202 · Exercise 9 — React Component 1 (đúng 4 bước của đề trường, mỗi bước một bài, nâng dần).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });

export default doiDau({
  slug: 'fer202-5-ex9-component-1',
  ten: '5.4 Exercise 9 — React Component 1',
  khoa: KHOA,
  baiHoc: 'fer202-5-ex9-component-1',
  de: [
    reactNho({
      tieuDe: 'About-me component from props',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['props', 'component'], the: ['components', 'exercise-9'],
      moTa: {
        en: '<p>Step 1 of Exercise 9: a component that displays your name and a short message about yourself. Make it reusable — the data comes from props.</p>',
        vi: '<p>Bước 1 của Exercise 9: component hiển thị tên bạn và một lời giới thiệu ngắn. Làm cho nó dùng lại được — dữ liệu đến từ props.</p>',
      },
      yeuCau: [
        { en: '<code>AboutMe({ name, message })</code> ⇒ <code>div.about</code> with <code>h2</code> name and <code>p</code> message.', vi: '<code>AboutMe({ name, message })</code> ⇒ <code>div.about</code> gồm <code>h2</code> tên và <code>p</code> lời giới thiệu.' },
        { en: 'App renders it twice (you and a friend).', vi: 'App vẽ nó hai lần (bạn và một người bạn).' },
      ],
      viDu: [{ input: '<AboutMe name="Cuong" message="I love React." />', output: '<div class="about"><h2>Cuong</h2><p>I love React.</p></div>', explanation: 'Same component, different props.|||Cùng component, khác props.' }],
      goiY: ['function AboutMe({ name, message }) { return (<div className="about">…</div>); }', 'App: <AboutMe name="Cuong" message="…" /> và một lần nữa với tên khác.'],
      loiHayGap: ['Viết cứng tên trong component ⇒ không dùng lại được.', 'Trả về hai thẻ ngang hàng không có thẻ bọc ⇒ lỗi JSX.'],
      thuatNgu: [{ en: 'props', vi: 'tham số truyền vào component' }],
      giaiThich: '<p>Component nhận dữ liệu qua props nên một định nghĩa phục vụ nhiều người. Đây là bước "props-down" đầu tiên của Exercise 9.</p>',
      dau: `// src/App.js — STARTER
export default function App() {
  // TODO: component AboutMe dùng hai lần
  return <h1>About</h1>;
}
`,
      giai: `// src/App.js — một component, dữ liệu qua props
function AboutMe({ name, message }) {
  return (
    <div className="about">
      <h2>{name}</h2>
      <p>{message}</p>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <AboutMe name="Cuong" message="I am learning React at FPT University." />
      <AboutMe name="Lan" message="I build UIs with React-Bootstrap." />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Two .about blocks', kiem: 'so-luong', selector: '.about', giaTri: 2 },
        { moTa: 'Each has a name and a message', kiem: 'so-luong', selector: '.about > h2 + p', giaTri: 2 },
        { moTa: 'AboutMe takes name and message props', kiem: 'ma-nguon', khop: 'function\\s+AboutMe\\s*\\(\\s*\\{\\s*name\\s*,\\s*message\\s*\\}' },
      ],
    }),
    reactNho({
      tieuDe: 'Hello, World! as a component tree',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['component tree', 'nesting'], the: ['components', 'exercise-9'],
      moTa: {
        en: '<p>Step 2: render <b>Hello, World!</b> — but as a small tree: <code>App</code> → <code>Greeting</code> → <code>Hello</code> + <code>World</code>, so you see how components nest.</p>',
        vi: '<p>Bước 2: hiển thị <b>Hello, World!</b> — nhưng dưới dạng cây nhỏ: <code>App</code> → <code>Greeting</code> → <code>Hello</code> + <code>World</code>, để thấy component lồng nhau thế nào.</p>',
      },
      yeuCau: [
        { en: '<code>h1#greeting</code> containing <code>span.hello</code> "Hello," and <code>span.world</code> "World!" (rendered by two components).', vi: '<code>h1#greeting</code> chứa <code>span.hello</code> "Hello," và <code>span.world</code> "World!" (do hai component vẽ).' },
      ],
      viDu: [{ input: '<Greeting />', output: '<h1 id="greeting"><span class="hello">Hello,</span> <span class="world">World!</span></h1>', explanation: 'A component can render other components.|||Component có thể vẽ component khác.' }],
      goiY: ['const Hello = () => <span className="hello">Hello,</span>;', 'function Greeting() { return <h1 id="greeting"><Hello /> <World /></h1>; }'],
      loiHayGap: ['Khai báo component BÊN TRONG component khác ⇒ mỗi lần render tạo component mới (mất state, chậm).', 'Thiếu khoảng trắng giữa hai span ⇒ "Hello,World!".'],
      thuatNgu: [{ en: 'component tree', vi: 'cây component' }],
      giaiThich: '<p>Ứng dụng React là một cây component; mỗi component vẽ con của nó. Khai báo component ở cấp module, không lồng định nghĩa trong hàm khác.</p>',
      dau: `// src/App.js — STARTER
export default function App() {
  return <h1>Hello, World!</h1>;
}
`,
      giai: `// src/App.js — cây nhỏ: App → Greeting → Hello + World (khai báo ở cấp module)
const Hello = () => <span className="hello">Hello,</span>;
const World = () => <span className="world">World!</span>;

function Greeting() {
  return (
    <h1 id="greeting">
      <Hello /> <World />
    </h1>
  );
}

export default function App() {
  return <Greeting />;
}
`,
      kiem: [
        { moTa: 'Greeting text', kiem: 'text', selector: '#greeting', giaTri: 'Hello, World!' },
        { moTa: 'Built from .hello and .world spans', kiem: 'so-luong', selector: '#greeting > span.hello, #greeting > span.world', giaTri: 2 },
        { an: true, moTa: 'Hello and World are components', kiem: 'ma-nguon', khop: '<Hello\\s*/>[\\s\\S]*<World\\s*/>' },
      ],
    }),
    reactNho({
      tieuDe: 'Counter with increment and decrement',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['useState', 'onClick'], the: ['state', 'exercise-9'],
      moTa: {
        en: '<p>Step 3: a counter with <b>+</b> and <b>−</b> buttons using <code>useState</code>. The colour of the number shows its sign: positive green, negative red, zero gray (class names).</p>',
        vi: '<p>Bước 3: bộ đếm có nút <b>+</b> và <b>−</b> dùng <code>useState</code>. Màu số cho biết dấu: dương xanh, âm đỏ, bằng 0 xám (theo class).</p>',
      },
      yeuCau: [
        { en: '<code>#count</code> with class <code>positive</code>/<code>negative</code>/<code>zero</code>; <code>#inc</code>, <code>#dec</code>.', vi: '<code>#count</code> có class <code>positive</code>/<code>negative</code>/<code>zero</code>; <code>#inc</code>, <code>#dec</code>.' },
      ],
      viDu: [{ input: 'click − twice', output: '-2 (class negative)', explanation: 'The class is derived from the count.|||Class suy ra từ số đếm.' }],
      goiY: ['const [count, setCount] = useState(0);', "const tone = count > 0 ? 'positive' : count < 0 ? 'negative' : 'zero';"],
      loiHayGap: ['Lưu màu vào state riêng ⇒ dễ lệch với số.', 'Dùng biến thường thay cho state ⇒ không vẽ lại.'],
      thuatNgu: [{ en: 'increment / decrement', vi: 'tăng / giảm' }],
      giaiThich: '<p>State giữ số; class màu là giá trị suy ra nên không cần state thứ hai.</p>',
      dau: `// src/App.js — STARTER
export default function App() {
  return (
    <div>
      <button id="dec">−</button>
      <span id="count">0</span>
      <button id="inc">+</button>
    </div>
  );
}
`,
      giai: `// src/App.js — state cho số, class màu là giá trị suy ra
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const tone = count > 0 ? 'positive' : count < 0 ? 'negative' : 'zero';
  return (
    <div>
      <button id="dec" type="button" onClick={() => setCount((c) => c - 1)}>−</button>
      <span id="count" className={tone}>{count}</span>
      <button id="inc" type="button" onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Starts at 0 (zero)', kiem: 'text', selector: '#count.zero', giaTri: '0' },
        { moTa: '+ three times ⇒ 3 positive', kiem: 'text', selector: '#count.positive', giaTri: '3', truoc: [click('#inc', 3)] },
        { moTa: '− twice ⇒ -2 negative', kiem: 'text', selector: '#count.negative', giaTri: '-2', truoc: [click('#dec', 2)] },
      ],
    }),
    reactNho({
      tieuDe: 'SimpleCard composed from leaf components',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['leaf components', 'composition', 'props design'], the: ['components', 'exercise-9'],
      moTa: {
        en: '<p>Step 4 (the main task of Exercise 9): build the classic social card from the <b>leaves up</b> — <code>Title</code>, <code>Description</code>, <code>Image</code> — then compose them in <code>SimpleCard({ item })</code>, and render a feed of cards from an array.</p>',
        vi: '<p>Bước 4 (bài chính của Exercise 9): dựng thẻ mạng xã hội từ <b>lá lên gốc</b> — <code>Title</code>, <code>Description</code>, <code>Image</code> — rồi ghép trong <code>SimpleCard({ item })</code>, và vẽ một bảng tin nhiều thẻ từ mảng.</p>',
      },
      yeuCau: [
        { en: '<code>Title({ text })</code> ⇒ <code>h3.card-title</code>; <code>Description({ text })</code> ⇒ <code>p.card-desc</code>; <code>Image({ url, alt })</code> ⇒ <code>img.card-img</code> width 120.', vi: '<code>Title({ text })</code> ⇒ <code>h3.card-title</code>; <code>Description({ text })</code> ⇒ <code>p.card-desc</code>; <code>Image({ url, alt })</code> ⇒ <code>img.card-img</code> rộng 120.' },
        { en: '<code>SimpleCard({ item })</code> ⇒ <code>div.simple-card</code> with Image, Title, Description in that order; App maps <code>POSTS</code> to cards.', vi: '<code>SimpleCard({ item })</code> ⇒ <code>div.simple-card</code> gồm Image, Title, Description theo thứ tự; App map <code>POSTS</code> thành các thẻ.' },
      ],
      viDu: [{ input: "{ id: 1, title: 'My first post', description: 'Hello!', imageUrl: '…' }", output: '<div class="simple-card"><img class="card-img"…><h3 class="card-title">My first post</h3><p class="card-desc">Hello!</p></div>', explanation: 'Decide each component’s props first, then build bottom-up.|||Quyết định props của từng component trước, rồi dựng từ dưới lên.' }],
      goiY: ['Lá trước: function Title({ text }) { return <h3 className="card-title">{text}</h3>; }', 'SimpleCard: <Image url={item.imageUrl} alt={item.title} /><Title text={item.title} /><Description text={item.description} />'],
      loiHayGap: ['Truyền cả <code>item</code> xuống <code>Title</code> ⇒ lá phụ thuộc vào hình dạng dữ liệu.', 'Thiếu <code>key</code> khi map POSTS.'],
      thuatNgu: [{ en: 'leaf component', vi: 'component lá (không chứa component khác)' }, { en: 'bottom-up', vi: 'dựng từ dưới lên' }],
      giaiThich: '<p>Lá nhận đúng thứ nó cần (<code>text</code>, <code>url</code>) nên dùng được ở bất kỳ đâu; <code>SimpleCard</code> làm nhiệm vụ "ánh xạ" dữ liệu bài viết sang props của lá. Đây là tư duy props-down mà Exercise 9 muốn luyện.</p>',
      dau: `// src/App.js — STARTER
const POSTS = [
  { id: 1, title: 'My first post', description: 'Hello React world!', imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=p1' },
  { id: 2, title: 'Learning props', description: 'Data goes down, events go up.', imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=p2' },
  { id: 3, title: 'Exam soon', description: 'PE in week 9!', imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=p3' },
];

export default function App() {
  // TODO: Title, Description, Image → SimpleCard → map POSTS
  return <div id="feed">{POSTS.length} posts</div>;
}
`,
      giai: `// src/App.js — dựng từ LÁ (Title, Description, Image) lên GỐC (SimpleCard), rồi map dữ liệu
const POSTS = [
  { id: 1, title: 'My first post', description: 'Hello React world!', imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=p1' },
  { id: 2, title: 'Learning props', description: 'Data goes down, events go up.', imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=p2' },
  { id: 3, title: 'Exam soon', description: 'PE in week 9!', imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=p3' },
];

function Title({ text }) {
  return <h3 className="card-title">{text}</h3>;
}
function Description({ text }) {
  return <p className="card-desc">{text}</p>;
}
function Image({ url, alt }) {
  return <img className="card-img" src={url} alt={alt} width={120} />;
}

function SimpleCard({ item }) {
  return (
    <div className="simple-card">
      <Image url={item.imageUrl} alt={item.title} />
      <Title text={item.title} />
      <Description text={item.description} />
    </div>
  );
}

export default function App() {
  return (
    <div id="feed">
      {POSTS.map((p) => <SimpleCard key={p.id} item={p} />)}
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Three cards in the feed', kiem: 'so-luong', selector: '#feed > .simple-card', giaTri: 3 },
        { moTa: 'Card parts in order: img, title, description', kiem: 'so-luong', selector: '.simple-card > img.card-img:first-child + h3.card-title + p.card-desc', giaTri: 3 },
        { moTa: 'Titles from data', kiem: 'danh-sach-text', selector: '.card-title', mongDoi: ['My first post', 'Learning props', 'Exam soon'] },
        { moTa: 'Leaf components take minimal props', kiem: 'ma-nguon', khop: 'function\\s+Title\\s*\\(\\s*\\{\\s*text\\s*\\}' },
        { an: true, moTa: 'Image alt is the title', kiem: 'thuoc-tinh', selector: '.simple-card:first-child img', thuocTinh: 'alt', giaTri: 'My first post' },
      ],
    }),
  ],
});
