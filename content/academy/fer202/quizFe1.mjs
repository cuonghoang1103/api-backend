/**
 * FER202 · English FE-style MCQ bank (Ch1–Ch8) — appended to each chapter quiz by FER202.mjs. Soạn 21/11/2026.
 * Văn phong bắt chước câu FE thật (xem chuaQuiz.mjs). Câu hỏi + đáp án tiếng Anh; giải thích 'EN|||VI'.
 * Code answers verified by running (node for plain JS; vitest + jsdom + React Testing Library / renderToStaticMarkup
 * on react 18.3.1, react-bootstrap 2, prop-types; json-server 0.17.4 for the URL question).
 */
const BANK = {
  /* ───────────── Chapter 1 — Overview & Setup ───────────── */
  ch1: [
    {
      question: 'Which command creates a new React project using Vite?',
      options: [
        'npm create vite@latest my-app -- --template react',
        'npm install vite-react my-app',
        'npx react-create my-app --vite',
        'vite new react my-app',
      ],
      correctIndex: 0, points: 1,
      explanation: 'npm create vite@latest scaffolds a project; --template react picks the React template (react-ts for TypeScript).|||npm create vite@latest dựng khung dự án; --template react chọn mẫu React (react-ts nếu dùng TypeScript).',
    },
    {
      question: 'What is the difference between "dependencies" and "devDependencies" in package.json?',
      options: [
        'dependencies are installed globally, devDependencies locally',
        'dependencies are needed by the app at runtime; devDependencies are only needed while developing/building (e.g. Vite, ESLint)',
        'devDependencies are bundled into the production build, dependencies are not',
        'There is no difference; both fields are aliases',
      ],
      correctIndex: 1, points: 1,
      explanation: 'react and react-dom are runtime dependencies; tools such as vite, eslint or testing libraries go in devDependencies (npm install -D).|||react, react-dom là dependencies lúc chạy; công cụ như vite, eslint, thư viện test nằm ở devDependencies (npm install -D).',
    },
    {
      question: 'In the package.json above, what happens when you run "npm run dev"?',
      code: `{
  "name": "my-app",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`,
      codeLang: 'javascript',
      options: [
        'npm installs Vite again',
        'It builds an optimized production bundle into dist/',
        'npm runs the "dev" script, which starts the Vite development server (by default on http://localhost:5173)',
        'It deploys the app to GitHub Pages',
      ],
      correctIndex: 2, points: 1,
      explanation: 'npm run <name> executes the command stored under scripts.<name>; "vite" starts the dev server with hot reload, default port 5173.|||npm run <tên> chạy lệnh ghi ở scripts.<tên>; "vite" bật server phát triển có hot reload, cổng mặc định 5173.',
    },
    {
      question: 'What is the main purpose of package-lock.json?',
      options: [
        'It stores the exact versions of every installed package so that installs are reproducible on every machine',
        'It prevents other developers from changing package.json',
        'It lists the scripts the project can run',
        'It locks the project so it cannot be published to npm',
      ],
      correctIndex: 0, points: 1,
      explanation: 'package.json holds version ranges like ^18.3.1; package-lock.json records the exact resolved tree. Commit it to Git.|||package.json ghi khoảng phiên bản như ^18.3.1; package-lock.json ghi đúng cây phiên bản đã cài. Nên commit nó lên Git.',
    },
    {
      question: 'You clone a React project from GitHub and run "npm run dev", but get "vite: command not found". What is the most likely fix?',
      options: [
        'Reinstall Node.js',
        'Delete package.json',
        'Run "npm install" first, because node_modules is not committed to Git',
        'Rename the project folder',
      ],
      correctIndex: 2, points: 1,
      explanation: 'node_modules is in .gitignore, so a fresh clone has no installed packages; npm install reads package.json (and the lock file) and installs them.|||node_modules nằm trong .gitignore nên bản clone mới chưa có gói nào; npm install đọc package.json (và file lock) để cài lại.',
    },
    {
      question: 'Which sequence correctly pushes a brand-new local project to an empty GitHub repository for the first time?',
      options: [
        'git push -u origin main → git init → git add . → git commit -m "init"',
        'git init → git add . → git commit -m "init" → git remote add origin <url> → git push -u origin main',
        'git clone <url> → git commit -m "init" → git add . → git push',
        'git init → git push origin main → git add . → git commit -m "init"',
      ],
      correctIndex: 1, points: 1,
      explanation: 'Create the repo, stage, commit, link the remote, then push (-u sets upstream so later you only type git push).|||Tạo repo, stage, commit, gắn remote rồi push (-u đặt upstream để lần sau chỉ cần git push).',
    },
    {
      question: 'json-server is started with the command below. Which URL returns only the course whose id is 2?',
      code: `// db.json
{ "courses": [ { "id": 1, "title": "React" }, { "id": 2, "title": "Redux" } ] }

// terminal
npx json-server --watch db.json --port 9999`,
      codeLang: 'javascript',
      options: [
        'http://localhost:3000/courses/2',
        'http://localhost:9999/db.json/courses/2',
        'http://localhost:9999/courses/2',
        'http://localhost:9999/api/courses?id=2',
      ],
      correctIndex: 2, points: 1,
      explanation: 'Each top-level key of db.json becomes a resource: /courses lists all, /courses/2 returns the object with id 2 on the chosen port 9999.|||Mỗi khoá cấp gốc của db.json thành một resource: /courses trả cả danh sách, /courses/2 trả object có id 2, ở cổng đã chọn 9999.',
    },
    {
      question: 'Which of the following is NOT true about React?',
      options: [
        'React builds UIs from reusable components',
        'React is declarative: you describe the UI for a given state',
        'React uses a virtual DOM to update only what changed',
        'React is a full framework with a built-in router and HTTP client',
      ],
      correctIndex: 3, points: 1,
      explanation: 'React is a UI library; routing (React Router) and HTTP (fetch/axios) come from other packages.|||React là thư viện UI; định tuyến (React Router) và gọi HTTP (fetch/axios) đến từ gói khác.',
    },
    {
      question: 'What does the code above in src/main.jsx do?',
      code: `import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);`,
      codeLang: 'javascript',
      options: [
        'It creates a new HTML file called root.html',
        'It renders the App component inside the element with id="root" in index.html',
        'It replaces index.html with App.jsx at build time',
        'It registers App as a service worker',
      ],
      correctIndex: 1, points: 1,
      explanation: 'index.html contains <div id="root"></div>; createRoot(...).render mounts the React tree inside it (React 18 API).|||index.html có <div id="root"></div>; createRoot(...).render gắn cây React vào đó (API React 18).',
    },
    {
      question: 'After running "npm run build" in a Vite React project, where is the optimized production output placed by default?',
      options: ['build/', 'public/', 'dist/', 'node_modules/.vite/'],
      correctIndex: 2, points: 1,
      explanation: 'Vite outputs to dist/ (Create React App used build/). public/ holds static files copied as-is.|||Vite xuất ra dist/ (Create React App dùng build/). public/ chứa file tĩnh được chép nguyên.',
    },
  ],

  /* ───────────── Chapter 2 — ES6 for React ───────────── */
  ch2: [
    {
      question: 'What is logged to the console?',
      code: `const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a.length);`,
      codeLang: 'javascript',
      options: ['3', '4', 'undefined', 'TypeError: a is a constant'],
      correctIndex: 1, points: 1,
      explanation: 'b = a copies the reference, not the array; both names point to the same array, so a.length is 4. const only forbids reassignment.|||b = a chép tham chiếu, không chép mảng; hai tên trỏ cùng một mảng nên a.length là 4. const chỉ cấm gán lại.',
    },
    {
      question: 'What is logged to the console?',
      code: `const user = { name: 'An', address: { city: 'HN' } };
const copy = { ...user };
copy.address.city = 'DN';
console.log(user.address.city);`,
      codeLang: 'javascript',
      options: ['HN', 'DN', 'undefined', 'An error is thrown'],
      correctIndex: 1, points: 1,
      explanation: 'Spread makes a SHALLOW copy: copy.address is still the same object as user.address. Copy nested levels too: { ...user, address: { ...user.address, city: "DN" } }.|||Spread chỉ chép NÔNG: copy.address vẫn là cùng object với user.address. Phải chép cả tầng lồng: { ...user, address: { ...user.address, city: "DN" } }.',
    },
    {
      question: 'What is printed by the code above?',
      code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));
}`,
      codeLang: 'javascript',
      options: ['0 1 2', '3 3 3', 'undefined undefined undefined', '0 0 0'],
      correctIndex: 1, points: 1,
      explanation: 'var is function-scoped, so all three callbacks share one i, which is 3 when they run. With let each iteration gets its own i and prints 0 1 2.|||var có phạm vi hàm nên ba callback dùng chung một i, lúc chạy i đã là 3. Dùng let thì mỗi vòng có i riêng, in 0 1 2.',
    },
    {
      question: 'What is the result of the expression above?',
      code: `[3, 1, 10, 2].sort();`,
      codeLang: 'javascript',
      options: ['[1, 2, 3, 10]', '[10, 3, 2, 1]', '[1, 10, 2, 3]', '[3, 1, 10, 2]'],
      correctIndex: 2, points: 1,
      explanation: 'Without a comparator sort() compares values as strings ("10" < "2"). Use [...arr].sort((a, b) => a - b) for numbers, and copy first because sort mutates.|||Không có hàm so sánh, sort() so như chuỗi ("10" < "2"). Với số dùng [...arr].sort((a, b) => a - b), và chép trước vì sort sửa mảng gốc.',
    },
    {
      question: 'What is logged to the console?',
      code: `const { title: t, price = 10 } = { title: 'React' };
console.log(t, price);`,
      codeLang: 'javascript',
      options: ['React 10', 'undefined 10', 'React undefined', 'SyntaxError'],
      correctIndex: 0, points: 1,
      explanation: 'title: t renames the property to the variable t; price = 10 is a default used because the object has no price.|||title: t đổi tên thuộc tính thành biến t; price = 10 là giá trị mặc định vì object không có price.',
    },
    {
      question: 'Find the bug: make(1) is expected to return { id: 1 } but returns undefined. How do you fix it?',
      code: `const make = (id) => { id };
console.log(make(1)); // undefined`,
      codeLang: 'javascript',
      options: [
        'Use function instead of an arrow function',
        'Wrap the object literal in parentheses: const make = (id) => ({ id });',
        'Write { id: id } instead of { id }',
        'Add async before (id)',
      ],
      correctIndex: 1, points: 1,
      explanation: 'After => a { starts a function BODY, so "id" is just a statement and nothing is returned. Parentheses make it an object expression.|||Sau => dấu { mở THÂN hàm nên "id" chỉ là một câu lệnh, không trả gì. Bọc ngoặc tròn để nó thành biểu thức object.',
    },
    {
      question: 'Which array methods return a NEW array and leave the original unchanged? (Choose 2 answers)',
      options: ['push()', 'map()', 'sort()', 'filter()'],
      correctIndex: 1, correctIndexes: [1, 3], points: 1,
      explanation: 'map and filter build new arrays, which is why React state updates use them; push and sort change the array in place.|||map và filter tạo mảng mới, vì vậy cập nhật state React hay dùng chúng; push và sort sửa trực tiếp mảng gốc.',
    },
    {
      question: 'Header.js contains the exports above. Which import statement is correct?',
      code: `// Header.js
export default function Header() { /* ... */ }
export const VERSION = '1.0';`,
      codeLang: 'javascript',
      options: [
        "import { Header, VERSION } from './Header.js';",
        "import Header, VERSION from './Header.js';",
        "import Header, { VERSION } from './Header.js';",
        "import * as Header, { VERSION } from './Header.js';",
      ],
      correctIndex: 2, points: 1,
      explanation: 'The default export is imported without braces (any name); named exports go inside { } with the exact name.|||Export default import không có ngoặc nhọn (đặt tên tuỳ ý); export có tên phải nằm trong { } và đúng tên.',
    },
    {
      question: 'In what order are the letters printed?',
      code: `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`,
      codeLang: 'javascript',
      options: ['A B C D', 'A D B C', 'A D C B', 'A C D B'],
      correctIndex: 2, points: 1,
      explanation: 'Synchronous code runs first (A, D); then microtasks such as promise callbacks (C); then timers/macrotasks (B), even with 0 ms.|||Code đồng bộ chạy trước (A, D); rồi tới microtask như callback của promise (C); cuối cùng là timer/macrotask (B), dù 0 ms.',
    },
    {
      question: 'What does calling f() return?',
      code: `async function f() {
  return 5;
}
const r = f();`,
      codeLang: 'javascript',
      options: ['The number 5', 'undefined', 'A Promise that resolves to 5', 'A function'],
      correctIndex: 2, points: 1,
      explanation: 'An async function always returns a Promise; use await f() or f().then(v => ...) to get 5.|||Hàm async luôn trả về Promise; dùng await f() hoặc f().then(v => ...) để lấy 5.',
    },
  ],

  /* ───────────── Chapter 3 — JSX & Rendering ───────────── */
  ch3: [
    {
      question: 'What is rendered when count is 0?',
      code: `const count = 0;
return (
  <div>
    {count && <p>You have {count} messages</p>}
  </div>
);`,
      codeLang: 'javascript',
      options: [
        'An empty <div></div>',
        '<div>0</div>',
        '<div><p>You have 0 messages</p></div>',
        'An error, because count is a number',
      ],
      correctIndex: 1, points: 1,
      explanation: '0 && ... evaluates to 0, and React renders the number 0 as text. Use count > 0 && ... or a ternary.|||0 && ... cho kết quả 0, và React vẽ số 0 ra màn hình. Dùng count > 0 && ... hoặc toán tử ba ngôi.',
    },
    {
      question: 'With the classic JSX transform, what does the JSX above compile to?',
      code: `<h1 className="title">Hi</h1>`,
      codeLang: 'javascript',
      options: [
        'document.createElement("h1", "title", "Hi")',
        'React.createElement("h1", { className: "title" }, "Hi")',
        '"<h1 class=\\"title\\">Hi</h1>" (an HTML string)',
        'new HTMLHeadingElement({ className: "title" })',
      ],
      correctIndex: 1, points: 1,
      explanation: 'JSX is syntax sugar for React.createElement(type, props, ...children) (the new automatic runtime calls jsx() with the same idea). It produces objects, not strings.|||JSX là cú pháp rút gọn của React.createElement(type, props, ...children) (runtime tự động mới gọi jsx() cùng ý). Kết quả là object, không phải chuỗi.',
    },
    {
      question: 'How would you correctly convert the following HTML to JSX?',
      code: `<label for="email" class="form-label">Email</label>
<input type="text" style="color: red">`,
      codeLang: 'html',
      options: [
        '<label for="email" class="form-label">Email</label><input type="text" style="color: red">',
        '<label htmlFor="email" className="form-label">Email</label><input type="text" style={{ color: "red" }} />',
        '<label htmlFor="email" className="form-label">Email</label><input type="text" style="color: red" />',
        '<label for="email" className="form-label">Email</label><input type="text" style={color: "red"}>',
      ],
      correctIndex: 1, points: 1,
      explanation: 'In JSX: for → htmlFor, class → className, style takes an object (outer braces = JS, inner = object), and void tags must be self-closed.|||Trong JSX: for → htmlFor, class → className, style nhận object (ngoặc ngoài là JS, ngoặc trong là object), thẻ rỗng phải tự đóng.',
    },
    {
      question: 'Why does the component above fail to compile?',
      code: `function Article() {
  return <h1>Title</h1><p>Body</p>;
}`,
      codeLang: 'javascript',
      options: [
        'Because <p> cannot follow <h1>',
        'Because adjacent JSX elements must be wrapped in a single parent element or a Fragment',
        'Because function components must use the class syntax',
        'Because return needs a semicolon after </h1>',
      ],
      correctIndex: 1, points: 1,
      explanation: 'A component returns ONE value (one createElement call). Wrap siblings in <div>...</div> or <>...</>.|||Component trả về MỘT giá trị (một lời gọi createElement). Bọc các phần tử anh em trong <div>...</div> hoặc <>...</>.',
    },
    {
      question: 'Which expression inside JSX renders something visible on the screen?',
      options: ['{false}', '{null}', '{0}', '{undefined}'],
      correctIndex: 2, points: 1,
      explanation: 'false, null and undefined render nothing; numbers (including 0) render as text.|||false, null, undefined không vẽ gì; số (kể cả 0) được vẽ ra chữ.',
    },
    {
      question: 'Which of the following is NOT allowed directly inside JSX curly braces { }?',
      options: [
        'A ternary: {isLoggedIn ? <Logout /> : <Login />}',
        'A logical AND: {items.length > 0 && <List />}',
        'A function call: {formatPrice(price)}',
        'An if statement: {if (isLoggedIn) { <Logout /> }}',
      ],
      correctIndex: 3, points: 1,
      explanation: 'Curly braces accept EXPRESSIONS only. if/for are statements — use them before return, or use a ternary/&& inside JSX.|||Ngoặc nhọn chỉ nhận BIỂU THỨC. if/for là câu lệnh — đặt trước return, hoặc dùng ba ngôi/&& trong JSX.',
    },
    {
      question: 'What is the correct way to write a comment inside JSX markup?',
      options: ['<!-- comment -->', '// comment', '{/* comment */}', '# comment'],
      correctIndex: 2, points: 1,
      explanation: 'Inside JSX you are writing markup, so a JS comment must be put in an expression container: {/* ... */}.|||Trong JSX là vùng markup, nên chú thích JS phải nằm trong ngoặc biểu thức: {/* ... */}.',
    },
    {
      question: 'What does the code above render?',
      code: `const nums = [1, 2, 3, 4, 5];
return (
  <ul>
    {nums.filter((n) => n % 2).map((n) => <li key={n}>{n * 10}</li>)}
  </ul>
);`,
      codeLang: 'javascript',
      options: [
        'Five <li> items: 10, 20, 30, 40, 50',
        'Two <li> items: 20, 40',
        'Three <li> items: 10, 30, 50',
        'Three <li> items: 1, 3, 5',
      ],
      correctIndex: 2, points: 1,
      explanation: 'n % 2 is 1 (truthy) for odd numbers, so filter keeps 1, 3, 5; map multiplies each by 10.|||n % 2 bằng 1 (truthy) với số lẻ nên filter giữ 1, 3, 5; map nhân mỗi số với 10.',
    },
    {
      question: 'A developer writes the component above, but the text "Card" never appears. What is wrong?',
      code: `function card() {
  return <div>Card</div>;
}

export default function App() {
  return <card />;
}`,
      codeLang: 'javascript',
      options: [
        'Components must be exported with export default',
        'Lowercase tags are treated as HTML elements, so <card /> renders an unknown <card> element; component names must start with a capital letter',
        '<card /> must be written as <card></card>',
        'Function components cannot return a <div>',
      ],
      correctIndex: 1, points: 1,
      explanation: 'JSX treats <card> as the DOM tag "card" (rendered empty). Rename it to Card and use <Card />.|||JSX coi <card> là thẻ DOM tên "card" (vẽ rỗng). Đổi tên thành Card và dùng <Card />.',
    },
    {
      question: 'You map a list and need to return two sibling elements per item without an extra wrapper <div>. Which syntax lets you give the group a key?',
      options: [
        '<key={item.id}>...</>',
        '<React.Fragment key={item.id}>...</React.Fragment>',
        '<>...</> with key passed as the first child',
        '<Fragment id={item.id}>...</Fragment>',
      ],
      correctIndex: 1, points: 1,
      explanation: 'The short syntax <>...</> cannot take attributes; use <React.Fragment key={...}> (or <Fragment key> imported from react).|||Cú pháp ngắn <>...</> không nhận thuộc tính; dùng <React.Fragment key={...}> (hoặc <Fragment key> import từ react).',
    },
  ],

  /* ───────────── Chapter 4 — Bootstrap & React-Bootstrap ───────────── */
  ch4: [
    {
      question: 'How many cards are displayed per row on a large screen (≥ 992px)?',
      code: `<div class="row">
  <div class="col-sm-6 col-lg-3">Card 1</div>
  <div class="col-sm-6 col-lg-3">Card 2</div>
  <div class="col-sm-6 col-lg-3">Card 3</div>
  <div class="col-sm-6 col-lg-3">Card 4</div>
</div>`,
      codeLang: 'html',
      options: ['1', '2', '3', '4'],
      correctIndex: 3, points: 1,
      explanation: 'From lg up col-lg-3 applies: 12 / 3 = 4 per row. From sm to md col-sm-6 gives 2 per row; below sm the columns stack (1 per row).|||Từ lg trở lên áp col-lg-3: 12 / 3 = 4 thẻ một hàng. Từ sm tới md là col-sm-6 nên 2 thẻ; dưới sm các cột xếp chồng (1 thẻ).',
    },
    {
      question: 'Which Bootstrap 5 classes hide an element on screens smaller than md and show it as a block from md upward?',
      options: ['d-md-none d-block', 'd-none d-md-block', 'hidden-sm visible-md', 'invisible md:visible'],
      correctIndex: 1, points: 1,
      explanation: 'd-none hides it at every size; d-md-block overrides that from the md breakpoint (≥ 768px) up. Display utilities are mobile-first.|||d-none ẩn ở mọi cỡ; d-md-block ghi đè từ mốc md (≥ 768px) trở lên. Lớp display của Bootstrap đi từ mobile lên.',
    },
    {
      question: 'What is the difference between .container and .container-fluid in Bootstrap 5?',
      options: [
        '.container is always 100% wide; .container-fluid has a fixed max-width',
        '.container has a responsive max-width at each breakpoint; .container-fluid is 100% wide at every breakpoint',
        '.container-fluid disables the grid system',
        'They are identical; container-fluid is deprecated',
      ],
      correctIndex: 1, points: 1,
      explanation: '.container snaps to fixed max-widths (540, 720, 960…); .container-fluid always spans the full width of the viewport.|||.container co theo max-width cố định ở từng mốc (540, 720, 960…); .container-fluid luôn rộng toàn màn hình.',
    },
    {
      question: 'Which command installs React-Bootstrap together with the Bootstrap stylesheet it needs?',
      options: [
        'npm install react-bootstrap',
        'npm install react-bootstrap bootstrap',
        'npm install bootstrap-react',
        'npx add react-bootstrap --css',
      ],
      correctIndex: 1, points: 1,
      explanation: 'react-bootstrap ships only components; the CSS comes from the bootstrap package, imported once: import "bootstrap/dist/css/bootstrap.min.css".|||react-bootstrap chỉ có component; CSS nằm ở gói bootstrap, import một lần: import "bootstrap/dist/css/bootstrap.min.css".',
    },
    {
      question: 'Which CSS classes does the React-Bootstrap Button above render on the <button> element?',
      code: `import { Button } from 'react-bootstrap';

<Button variant="outline-danger" size="sm">Delete</Button>`,
      codeLang: 'javascript',
      options: [
        'btn danger outline small',
        'btn btn-danger btn-outline btn-small',
        'btn btn-outline-danger btn-sm',
        'button-outline-danger button-sm',
      ],
      correctIndex: 2, points: 1,
      explanation: 'variant becomes btn-<variant> and size becomes btn-<size>; the output is <button type="button" class="btn btn-outline-danger btn-sm">.|||variant thành btn-<variant>, size thành btn-<size>; kết quả là <button type="button" class="btn btn-outline-danger btn-sm">.',
    },
    {
      question: 'Which pair of props controls whether a React-Bootstrap <Modal> is open and what happens when the user clicks its close button or the backdrop?',
      options: ['open and onClose', 'visible and onCancel', 'show and onHide', 'isOpen and toggle'],
      correctIndex: 2, points: 1,
      explanation: '<Modal show={show} onHide={() => setShow(false)}>: show is driven by your state, onHide is called on close/backdrop/Esc.|||<Modal show={show} onHide={() => setShow(false)}>: show do state của bạn quyết định, onHide được gọi khi bấm đóng/nền/Esc.',
    },
    {
      question: 'In React-Bootstrap, which prop marks a Form.Control as invalid (red border) and makes the sibling <Form.Control.Feedback type="invalid"> visible?',
      options: ['error', 'isInvalid', 'validated={false}', 'variant="danger"'],
      correctIndex: 1, points: 1,
      explanation: 'isInvalid adds the class is-invalid to the input; Bootstrap then shows the .invalid-feedback element that follows it.|||isInvalid thêm lớp is-invalid vào ô nhập; Bootstrap khi đó hiện phần tử .invalid-feedback ngay sau nó.',
    },
    {
      question: 'Which Tailwind CSS class string gives an element 1rem padding on all sides and a medium blue background?',
      options: ['padding-4 background-blue', 'p-4 bg-blue-500', 'pad-1 bg-blue', 'p-1rem blue-bg-500'],
      correctIndex: 1, points: 1,
      explanation: 'Tailwind is utility-first: p-4 = padding 1rem (spacing step 4 × 0.25rem), bg-blue-500 = a mid-shade blue background.|||Tailwind theo kiểu utility-first: p-4 = padding 1rem (bậc 4 × 0,25rem), bg-blue-500 = nền xanh tông giữa.',
    },
    {
      question: 'How many cards are displayed per row on a tablet screen (≥ 768px) in the code above?',
      code: `<Row xs={1} md={3}>
  {cards.map((c) => (
    <Col key={c.id}>
      <Card>{c.title}</Card>
    </Col>
  ))}
</Row>`,
      codeLang: 'javascript',
      options: ['1', '2', '3', 'As many as there are cards, all in one row'],
      correctIndex: 2, points: 1,
      explanation: 'Row xs={1} md={3} renders class "row row-cols-1 row-cols-md-3": 1 card per row on phones, 3 per row from md (768px) up.|||Row xs={1} md={3} sinh lớp "row row-cols-1 row-cols-md-3": điện thoại 1 thẻ/hàng, từ md (768px) trở lên 3 thẻ/hàng.',
    },
    {
      question: 'In Bootstrap 5, what does class="mt-3 px-2" mean?',
      options: [
        'margin-top: 3px and padding-x: 2px',
        'margin-top at spacing level 3 (1rem) and horizontal padding (left + right) at level 2 (0.5rem)',
        'max-top 3 rows and 2 extra columns',
        'margin on all sides 3rem and padding-top 2rem',
      ],
      correctIndex: 1, points: 1,
      explanation: 'Spacing utilities are {property}{side}-{size}: m/p, t/b/s/e/x/y, sizes 0–5 where 3 = 1rem and 2 = 0.5rem.|||Lớp khoảng cách có dạng {thuộc tính}{phía}-{cỡ}: m/p, t/b/s/e/x/y, cỡ 0–5 trong đó 3 = 1rem, 2 = 0,5rem.',
    },
  ],

  /* ───────────── Chapter 5 — Components & State ───────────── */
  ch5: [
    {
      question: 'The count state starts at 0. What is displayed on the button after ONE click?',
      code: `class Counter extends React.Component {
  state = { count: 0 };
  increment = () => {
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}`,
      codeLang: 'javascript',
      options: ['0', '1', '2', 'An error is thrown'],
      correctIndex: 1, points: 1,
      explanation: 'setState is batched; both calls read the same this.state.count (0), so the result is 1. Use this.setState(prev => ({ count: prev.count + 1 })) to add 2.|||setState được gộp; hai lời gọi cùng đọc this.state.count (0) nên kết quả là 1. Dùng this.setState(prev => ({ count: prev.count + 1 })) để cộng 2.',
    },
    {
      question: 'Which of the following are valid ways to define a React component? (Choose 2 answers)',
      options: [
        'A function that returns JSX: function Hello() { return <h1>Hi</h1>; }',
        'A class that extends React.Component and has a render() method',
        'A plain object with a template key: const Hello = { template: "<h1>Hi</h1>" }',
        'A JSON file that describes the markup',
      ],
      correctIndex: 0, correctIndexes: [0, 1], points: 1,
      explanation: 'React components are either functions returning JSX or classes extending React.Component with render().|||Component React là hàm trả về JSX hoặc class kế thừa React.Component có render().',
    },
    {
      question: 'What happens when the component above is rendered in development?',
      code: `import PropTypes from 'prop-types';

function Price({ value }) {
  return <span>{value}</span>;
}
Price.propTypes = { value: PropTypes.number.isRequired };

<Price value="100" />`,
      codeLang: 'javascript',
      options: [
        'Nothing is rendered and the app crashes',
        'React converts "100" to the number 100 automatically',
        '"100" is rendered, and a "Failed prop type" warning is printed in the console',
        'The build fails with a type error',
      ],
      correctIndex: 2, points: 1,
      explanation: 'PropTypes only WARN in the console (development only); they never block rendering or convert values.|||PropTypes chỉ CẢNH BÁO trên console (chỉ ở môi trường dev); không chặn render, không đổi kiểu giá trị.',
    },
    {
      question: 'In which order are these class component methods called when the component is mounted for the first time?',
      options: [
        'render → constructor → componentDidMount',
        'constructor → componentDidMount → render',
        'constructor → render → componentDidMount',
        'componentDidMount → constructor → render',
      ],
      correctIndex: 2, points: 1,
      explanation: 'Mounting: constructor (init state) → render (describe UI) → componentDidMount (after the DOM exists — fetch data, start timers).|||Gắn lần đầu: constructor (khởi tạo state) → render (mô tả UI) → componentDidMount (sau khi DOM đã có — gọi API, bật timer).',
    },
    {
      question: 'What is componentWillUnmount typically used for?',
      options: [
        'Fetching the initial data',
        'Cleaning up timers, subscriptions or listeners before the component is removed',
        'Deciding whether the component should re-render',
        'Setting the initial state',
      ],
      correctIndex: 1, points: 1,
      explanation: 'It runs just before removal; clear intervals and unsubscribe there to avoid memory leaks (the hook equivalent is the cleanup returned by useEffect).|||Nó chạy ngay trước khi gỡ component; xoá interval, huỷ đăng ký ở đây để tránh rò bộ nhớ (tương đương trong hook là hàm cleanup của useEffect).',
    },
    {
      question: 'In a class component, where should the initial state be set?',
      options: [
        'Inside render()',
        'In the constructor with this.state = { ... } (or as a class field state = { ... })',
        'By calling this.setState() inside the constructor',
        'In componentWillUnmount',
      ],
      correctIndex: 1, points: 1,
      explanation: 'Assign this.state directly only in the constructor/class field; everywhere else use setState. Calling setState in render causes an infinite loop.|||Gán thẳng this.state chỉ trong constructor/class field; chỗ khác dùng setState. Gọi setState trong render gây vòng lặp vô hạn.',
    },
    {
      question: 'Two sibling components need to show and change the same counter value. What is the recommended React approach?',
      options: [
        'Store the counter in a global variable outside React',
        'Give each sibling its own useState and keep them in sync with useEffect',
        'Lift the state up to their closest common parent and pass the value and an update function down as props',
        'Let one sibling read the other\'s state with a ref',
      ],
      correctIndex: 2, points: 1,
      explanation: 'Data flows down: the parent owns the state, passes value via props and a callback for changes (lifting state up).|||Dữ liệu chảy xuống: cha giữ state, truyền giá trị qua props và một callback để đổi (nâng state lên).',
    },
    {
      question: 'items starts as ["a"]. What is displayed in the <p> after clicking "add"?',
      code: `function List() {
  const [items, setItems] = useState(['a']);
  const add = () => {
    items.push('b');
    setItems(items);
  };
  return (
    <>
      <button onClick={add}>add</button>
      <p>{items.length}</p>
    </>
  );
}`,
      codeLang: 'javascript',
      options: ['2, because push added an item', '1, because React sees the same array reference and skips the re-render', '0', 'An error, because items is a constant'],
      correctIndex: 1, points: 1,
      explanation: 'setItems(items) passes the SAME reference, so React bails out (Object.is) and the screen keeps showing 1. Use setItems([...items, "b"]).|||setItems(items) truyền CÙNG tham chiếu nên React bỏ qua (Object.is), màn hình vẫn là 1. Dùng setItems([...items, "b"]).',
    },
    {
      question: 'React components should be "pure" while rendering. What does that mean?',
      options: [
        'They must not use any props',
        'Given the same props and state they return the same JSX, and they do not change outside variables or call APIs during render',
        'They must be written as classes',
        'They cannot contain event handlers',
      ],
      correctIndex: 1, points: 1,
      explanation: 'Render must be a calculation only; side effects (fetch, timers, DOM changes) belong in event handlers or useEffect/componentDidMount.|||Render chỉ được tính toán; hiệu ứng phụ (fetch, timer, sửa DOM) đặt trong event handler hoặc useEffect/componentDidMount.',
    },
    {
      question: 'The parent first renders <Counter start={0} /> and later re-renders it with <Counter start={5} />. What does Counter display?',
      code: `function Counter({ start }) {
  const [count, setCount] = useState(start);
  return <p>{count}</p>;
}`,
      codeLang: 'javascript',
      options: ['5', '0', '"start"', 'undefined'],
      correctIndex: 1, points: 1,
      explanation: 'The argument of useState is used only on the FIRST render; later prop changes do not reset the state (change the key or sync explicitly if needed).|||Đối số của useState chỉ dùng ở lần render ĐẦU; prop đổi sau đó không reset state (cần thì đổi key hoặc đồng bộ có chủ đích).',
    },
  ],

  /* ───────────── Chapter 6 — Event Handling ───────────── */
  ch6: [
    {
      question: 'What happens when the button in the code above is clicked?',
      code: `class Btn extends React.Component {
  constructor() {
    super();
    this.state = { n: 0 };
  }
  inc() {
    this.setState({ n: this.state.n + 1 });
  }
  render() {
    return <button onClick={this.inc}>{this.state.n}</button>;
  }
}`,
      codeLang: 'javascript',
      options: [
        'n increases by 1',
        'Nothing happens, silently',
        'TypeError: Cannot read properties of undefined (reading \'setState\'), because inc is not bound to the instance',
        'The page reloads',
      ],
      correctIndex: 2, points: 1,
      explanation: 'A class method passed as a callback loses its this. Bind it in the constructor (this.inc = this.inc.bind(this)) or write it as an arrow class field.|||Method của class khi truyền làm callback bị mất this. Bind trong constructor (this.inc = this.inc.bind(this)) hoặc viết thành arrow class field.',
    },
    {
      question: 'Select the code snippets that correctly call handleDelete(item.id) only when the button is clicked. (Choose 2 answers)',
      options: [
        '<button onClick={() => handleDelete(item.id)}>Delete</button>',
        '<button onClick={handleDelete(item.id)}>Delete</button>',
        '<button onClick={handleDelete.bind(null, item.id)}>Delete</button>',
        '<button onClick="handleDelete(item.id)">Delete</button>',
      ],
      correctIndex: 0, correctIndexes: [0, 2], points: 1,
      explanation: 'Both an arrow wrapper and bind create a NEW function to run later. handleDelete(item.id) runs during render; a string is not a valid handler in React.|||Cả arrow bọc ngoài lẫn bind đều tạo hàm MỚI để chạy sau. handleDelete(item.id) chạy ngay lúc render; chuỗi không phải handler hợp lệ trong React.',
    },
    {
      question: 'n starts at 0. What does the button show after ONE click?',
      code: `const [n, setN] = useState(0);

<button onClick={() => {
  setN(n + 1);
  setN(n + 1);
  setN(n + 1);
}}>{n}</button>`,
      codeLang: 'javascript',
      options: ['0', '1', '3', '6'],
      correctIndex: 1, points: 1,
      explanation: 'State is a snapshot: during this click n is 0 in all three calls, so each one asks for 0 + 1 = 1.|||State là ảnh chụp: trong lần bấm này n đều là 0 ở cả ba lời gọi, nên mỗi lời gọi đều xin 0 + 1 = 1.',
    },
    {
      question: 'n starts at 0. What does the button show after ONE click?',
      code: `const [n, setN] = useState(0);

<button onClick={() => {
  setN((prev) => prev + 1);
  setN((prev) => prev + 1);
  setN((prev) => prev + 1);
}}>{n}</button>`,
      codeLang: 'javascript',
      options: ['1', '3', '0', 'NaN'],
      correctIndex: 1, points: 1,
      explanation: 'Updater functions are queued and each receives the result of the previous one: 0 → 1 → 2 → 3.|||Hàm cập nhật được xếp hàng, mỗi hàm nhận kết quả của hàm trước: 0 → 1 → 2 → 3.',
    },
    {
      question: 'n starts at 0. What does the alert show when the button is clicked?',
      code: `const [n, setN] = useState(0);

<button onClick={() => {
  setN(n + 5);
  alert(n);
}}>+5</button>`,
      codeLang: 'javascript',
      options: ['0', '5', 'undefined', '"n + 5"'],
      correctIndex: 0, points: 1,
      explanation: 'setN does not change n immediately; it schedules a re-render. Inside this handler n is still the snapshot value 0 (the next render shows 5).|||setN không đổi n ngay; nó hẹn một lần render lại. Trong handler này n vẫn là giá trị ảnh chụp 0 (lần render sau mới hiện 5).',
    },
    {
      question: 'What is logged when the button is clicked?',
      code: `<div onClick={() => console.log('div')}>
  <button onClick={() => console.log('button')}>Click</button>
</div>`,
      codeLang: 'javascript',
      options: ['button', 'div then button', 'button then div', 'div'],
      correctIndex: 2, points: 1,
      explanation: 'Events bubble from the target up to its ancestors. Call e.stopPropagation() in the button handler to stop the div handler.|||Sự kiện nổi bọt từ phần tử được bấm lên các phần tử cha. Gọi e.stopPropagation() trong handler của button để chặn handler của div.',
    },
    {
      question: 'When state changes, which is the correct order of the steps React goes through?',
      options: [
        'Commit → Render → Trigger',
        'Render → Trigger → Commit',
        'Trigger → Render → Commit',
        'Trigger → Commit → Render',
      ],
      correctIndex: 2, points: 1,
      explanation: 'Trigger (a state update or initial render) → Render (React calls your components) → Commit (React applies the differences to the DOM).|||Trigger (cập nhật state hoặc render lần đầu) → Render (React gọi component) → Commit (React áp phần khác biệt vào DOM).',
    },
    {
      question: 'Which statement about SyntheticEvent in React 17 and later is true?',
      options: [
        'Events are still pooled, so e.target becomes null after the handler returns',
        'Event pooling has been removed, so the event object can be read later (e.g. inside setTimeout) without e.persist()',
        'SyntheticEvent only works in class components',
        'SyntheticEvent cannot call preventDefault()',
      ],
      correctIndex: 1, points: 1,
      explanation: 'React wraps native events in a cross-browser SyntheticEvent. Pooling existed up to React 16 and was removed in React 17; e.persist() now does nothing.|||React bọc sự kiện gốc trong SyntheticEvent chạy giống nhau trên mọi trình duyệt. Pooling có tới React 16 và bị bỏ ở React 17; e.persist() giờ không làm gì.',
    },
    {
      question: 'In a controlled checkbox <input type="checkbox" checked={agree} onChange={handleChange} />, which value should handleChange read to update agree?',
      options: ['e.target.value', 'e.target.checked', 'e.checked', 'e.target.selected'],
      correctIndex: 1, points: 1,
      explanation: 'For checkboxes the boolean state is e.target.checked; e.target.value is the value attribute string ("on" by default).|||Với checkbox trạng thái đúng/sai là e.target.checked; e.target.value là chuỗi của thuộc tính value (mặc định "on").',
    },
    {
      question: 'In React, which event handler prop fires on every keystroke in a text <input> (unlike the native DOM "change" event, which fires on blur)?',
      options: ['onInputChange', 'onKeyChange', 'onChange', 'onBlur'],
      correctIndex: 2, points: 1,
      explanation: 'React\'s onChange behaves like the native input event: it runs on every edit, which is what controlled inputs rely on.|||onChange của React giống sự kiện input gốc: chạy ở mỗi lần gõ, đúng thứ mà ô nhập có kiểm soát cần.',
    },
  ],

  /* ───────────── Chapter 7 — Props patterns & Context ───────────── */
  ch7: [
    {
      question: 'In React 18+, what is the recommended way to give a function component a default value for a prop?',
      options: [
        'Component.defaultProps = { size: "md" }',
        'A default value in the destructured parameters: function Button({ size = "md" }) { ... }',
        'this.props.size || "md" inside a constructor',
        'PropTypes.default("md")',
      ],
      correctIndex: 1, points: 1,
      explanation: 'defaultProps on function components is deprecated (it warns in React 18.3 and is removed in React 19); use ES6 default parameters.|||defaultProps cho function component đã lỗi thời (React 18.3 cảnh báo, React 19 bỏ hẳn); dùng tham số mặc định của ES6.',
    },
    {
      question: 'What should a custom PropTypes validator return when the prop is INVALID?',
      code: `Product.propTypes = {
  quantity: (props, propName, componentName) => {
    if (!(props[propName] > 0)) {
      // ???
    }
    return null;
  },
};`,
      codeLang: 'javascript',
      options: [
        'false',
        'throw "invalid"',
        'A new Error object, e.g. return new Error(`Invalid prop ${propName} supplied to ${componentName}`)',
        'undefined',
      ],
      correctIndex: 2, points: 1,
      explanation: 'A custom validator returns an Error to signal failure (React prints it as a warning) and null when valid. It should not throw.|||Validator tự viết trả về một Error để báo sai (React in thành cảnh báo) và null khi hợp lệ. Không nên throw.',
    },
    {
      question: 'Label is rendered WITHOUT any ThemeContext.Provider above it. What does it render?',
      code: `const ThemeContext = createContext('light');

function Label() {
  const theme = useContext(ThemeContext);
  return <span>{theme}</span>;
}

// <Label />  — no Provider in the tree`,
      codeLang: 'javascript',
      options: ['<span>light</span>', '<span></span>', 'An error: context not provided', '<span>undefined</span>'],
      correctIndex: 0, points: 1,
      explanation: 'With no Provider above, useContext returns the default value passed to createContext ("light").|||Không có Provider phía trên thì useContext trả về giá trị mặc định truyền vào createContext ("light").',
    },
    {
      question: 'What does this tree render?',
      code: `const ThemeContext = createContext('light');
function Label() {
  return <span>{useContext(ThemeContext)}</span>;
}

<ThemeContext.Provider value="light">
  <ThemeContext.Provider value="dark">
    <Label />
  </ThemeContext.Provider>
</ThemeContext.Provider>`,
      codeLang: 'javascript',
      options: ['<span>light</span>', '<span>dark</span>', '<span>lightdark</span>', 'An error: nested providers are not allowed'],
      correctIndex: 1, points: 1,
      explanation: 'useContext reads the value of the NEAREST Provider above the component, so the inner "dark" wins.|||useContext đọc giá trị của Provider GẦN NHẤT phía trên component, nên "dark" ở trong thắng.',
    },
    {
      question: 'Which props does UserList receive when <UserListWithLoading loading={false} users={["An"]} /> is rendered?',
      code: `const withLoading = (Component) => ({ loading, ...rest }) =>
  loading ? <p>Loading...</p> : <Component {...rest} />;

const UserListWithLoading = withLoading(UserList);`,
      codeLang: 'javascript',
      options: [
        '{ loading: false, users: ["An"] }',
        '{ users: ["An"] }',
        '{ rest: { users: ["An"] } }',
        'No props; it renders <p>Loading...</p>',
      ],
      correctIndex: 1, points: 1,
      explanation: 'The HOC takes loading out with destructuring and forwards the remaining props with {...rest}.|||HOC lấy riêng loading bằng destructuring và chuyển phần props còn lại bằng {...rest}.',
    },
    {
      question: 'Which statement best describes a presentational (UI) component, compared with a container component?',
      options: [
        'It fetches data and manages state for its children',
        'It receives data and callbacks through props and only decides how things look',
        'It must be a class component',
        'It connects directly to the database',
      ],
      correctIndex: 1, points: 1,
      explanation: 'Container components handle data/logic (fetch, state) and pass it down; presentational components just render props, which makes them easy to reuse and test.|||Container lo dữ liệu/logic (fetch, state) rồi truyền xuống; component trình bày chỉ vẽ theo props nên dễ tái sử dụng và dễ test.',
    },
    {
      question: 'What HTML does the code above render?',
      code: `function Card({ title, children }) {
  return (
    <div>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

<Card title="A">
  <p>B</p>
  <p>C</p>
</Card>`,
      codeLang: 'javascript',
      options: [
        '<div><h3>A</h3></div>',
        '<div><h3>A</h3><p>B</p><p>C</p></div>',
        '<div><p>B</p><p>C</p><h3>A</h3></div>',
        '<Card title="A"><p>B</p><p>C</p></Card>',
      ],
      correctIndex: 1, points: 1,
      explanation: 'Everything between the opening and closing tags is passed as props.children and rendered where {children} is placed.|||Mọi thứ nằm giữa thẻ mở và thẻ đóng được truyền vào props.children và vẽ ra đúng chỗ đặt {children}.',
    },
    {
      question: 'What does the <p> show after the "+5" button is clicked twice?',
      code: `function Child({ onAdd }) {
  return <button onClick={() => onAdd(5)}>+5</button>;
}

function Parent() {
  const [total, setTotal] = useState(0);
  return (
    <>
      <Child onAdd={(n) => setTotal((t) => t + n)} />
      <p>{total}</p>
    </>
  );
}`,
      codeLang: 'javascript',
      options: ['0', '5', '10', '55'],
      correctIndex: 2, points: 1,
      explanation: 'The parent passes a function prop; the child calls it to send data UP. Two clicks add 5 twice: 10.|||Cha truyền một hàm qua props; con gọi hàm đó để gửi dữ liệu NGƯỢC lên. Hai lần bấm cộng 5 hai lần: 10.',
    },
    {
      question: 'Which PropTypes declaration validates that user is an object with a required string name and an optional number age?',
      options: [
        'user: PropTypes.object({ name: PropTypes.string, age: PropTypes.number })',
        'user: PropTypes.shape({ name: PropTypes.string.isRequired, age: PropTypes.number })',
        'user: PropTypes.arrayOf(PropTypes.string, PropTypes.number)',
        'user: PropTypes.oneOf(["name", "age"])',
      ],
      correctIndex: 1, points: 1,
      explanation: 'PropTypes.shape describes the keys of an object; add .isRequired to each key that must be present.|||PropTypes.shape mô tả các khoá của object; thêm .isRequired cho khoá bắt buộc phải có.',
    },
    {
      question: 'A Provider is written as <AuthContext.Provider value={{ user, setUser }}>. Why can this make every consumer re-render whenever the provider\'s parent re-renders?',
      options: [
        'Because setUser is called on every render',
        'Because a new object is created on each render, so the context value reference changes even if user did not',
        'Because Context does not support objects',
        'Because consumers always re-render on every state change in the app',
      ],
      correctIndex: 1, points: 1,
      explanation: 'Consumers re-render when the value changes by reference (Object.is). Memoize it: const value = useMemo(() => ({ user, setUser }), [user]).|||Consumer render lại khi value đổi tham chiếu (Object.is). Ghi nhớ nó: const value = useMemo(() => ({ user, setUser }), [user]).',
    },
  ],

  /* ───────────── Chapter 8 — Hooks ───────────── */
  ch8: [
    {
      question: 'What problem does the code above cause?',
      code: `const [data, setData] = useState([]);

useEffect(() => {
  setData([...data, 1]);
}, [data]);`,
      codeLang: 'javascript',
      options: [
        'The effect never runs',
        'An infinite render loop: each update creates a new data array, which is a dependency, so the effect runs again',
        'data stays an empty array',
        'A syntax error, because effects cannot call setState',
      ],
      correctIndex: 1, points: 1,
      explanation: 'The effect changes its own dependency every time. Remove data from the deps and use setData(d => [...d, 1]), or run it only once with [].|||Effect tự đổi chính phụ thuộc của nó mỗi lần chạy. Bỏ data khỏi deps và dùng setData(d => [...d, 1]), hoặc chỉ chạy một lần với [].',
    },
    {
      question: 'How often does useEffect(() => { ... }) run when NO dependency array is passed?',
      options: [
        'Only once, after the first render',
        'Never',
        'After every render of the component',
        'Only when the component unmounts',
      ],
      correctIndex: 2, points: 1,
      explanation: 'No array = run after every render; [] = only after mount; [a, b] = after mount and whenever a or b changes.|||Không có mảng = chạy sau mọi lần render; [] = chỉ sau lần gắn đầu; [a, b] = sau lần đầu và mỗi khi a hoặc b đổi.',
    },
    {
      question: 'The component is rendered with id={1}, then re-rendered with id={2}. What is logged, in order?',
      code: `function Tracker({ id }) {
  useEffect(() => {
    console.log('start ' + id);
    return () => console.log('stop ' + id);
  }, [id]);
  return null;
}`,
      codeLang: 'javascript',
      options: [
        'start 1, start 2',
        'start 1, stop 1, start 2',
        'start 1, start 2, stop 1',
        'start 1, stop 2, start 2',
      ],
      correctIndex: 1, points: 1,
      explanation: 'Before re-running an effect React calls the previous cleanup (with the OLD id); the cleanup also runs on unmount.|||Trước khi chạy lại effect, React gọi cleanup của lần trước (với id CŨ); cleanup cũng chạy khi gỡ component.',
    },
    {
      question: 'Starting from { total: 0 }, what is the state after dispatch({ type: "add", payload: 3 }) is called twice and then dispatch({ type: "unknown" }) once?',
      code: `function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { total: state.total + action.payload };
    case 'reset':
      return { total: 0 };
    default:
      return state;
  }
}`,
      codeLang: 'javascript',
      options: ['{ total: 3 }', '{ total: 6 }', '{ total: 0 }', 'An error for the unknown action'],
      correctIndex: 1, points: 1,
      explanation: '0 + 3 + 3 = 6; the default case returns the current state unchanged for actions the reducer does not handle.|||0 + 3 + 3 = 6; nhánh default trả nguyên state hiện tại cho action mà reducer không xử lý.',
    },
    {
      question: 'Find the bug: clicking the button never updates the displayed count. Why?',
      code: `function reducer(state, action) {
  if (action.type === 'add') {
    state.items.push(action.item);
    return state;
  }
  return state;
}

const [state, dispatch] = useReducer(reducer, { items: [] });
<button onClick={() => dispatch({ type: 'add', item: 'x' })}>{state.items.length}</button>`,
      codeLang: 'javascript',
      options: [
        'dispatch must be awaited',
        'The reducer mutates the state and returns the same object, so React sees no change and skips the re-render',
        'useReducer only works with numbers',
        'The action is missing a payload key',
      ],
      correctIndex: 1, points: 1,
      explanation: 'Reducers must be pure and return a NEW state: return { ...state, items: [...state.items, action.item] }.|||Reducer phải thuần và trả state MỚI: return { ...state, items: [...state.items, action.item] }.',
    },
    {
      question: 'Which statement about custom Hooks is correct?',
      options: [
        'A custom Hook must return JSX',
        'A custom Hook is a function whose name starts with "use" and that may call other Hooks; each component using it gets its own state',
        'Custom Hooks share one state between all components that call them',
        'Custom Hooks can only be used inside class components',
      ],
      correctIndex: 1, points: 1,
      explanation: 'A custom Hook (e.g. useFetch, useToggle) reuses LOGIC, not state: every call creates independent state.|||Custom Hook (vd useFetch, useToggle) tái sử dụng LOGIC chứ không chia sẻ state: mỗi lần gọi tạo state riêng.',
    },
    {
      question: 'Why is useEffect(async () => { const res = await fetch(url); ... }, []) considered incorrect?',
      options: [
        'Because fetch cannot be used inside effects',
        'Because an async function returns a Promise, but an effect must return nothing or a cleanup function',
        'Because await is not allowed in React',
        'Because the dependency array must not be empty',
      ],
      correctIndex: 1, points: 1,
      explanation: 'Define an async function INSIDE the effect and call it: useEffect(() => { const load = async () => {...}; load(); }, []).|||Khai báo hàm async BÊN TRONG effect rồi gọi nó: useEffect(() => { const load = async () => {...}; load(); }, []).',
    },
    {
      question: 'count starts at 0. What does the <p> show after 5 seconds?',
      code: `const [count, setCount] = useState(0);

useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);

return <p>{count}</p>;`,
      codeLang: 'javascript',
      options: ['5', '1', '0', 'It keeps increasing forever'],
      correctIndex: 1, points: 1,
      explanation: 'Stale closure: the interval was created on the first render and always sees count = 0, so it keeps setting 1. Use setCount(c => c + 1).|||Closure cũ: interval tạo ở lần render đầu luôn thấy count = 0 nên cứ đặt lại 1. Dùng setCount(c => c + 1).',
    },
    {
      question: 'How can deeply nested components read the state of a useReducer AND dispatch actions without prop drilling?',
      options: [
        'Call useReducer again in every child with the same reducer',
        'Put the state and dispatch from useReducer into a Context Provider value, then read them with useContext in the children',
        'Store dispatch in localStorage',
        'Export the state variable from the parent file',
      ],
      correctIndex: 1, points: 1,
      explanation: 'useReducer + Context is a lightweight global store: <StoreContext.Provider value={{ state, dispatch }}> and useContext(StoreContext) below.|||useReducer + Context là một store toàn cục gọn nhẹ: <StoreContext.Provider value={{ state, dispatch }}> rồi useContext(StoreContext) ở dưới.',
    },
    {
      question: 'In development, with the app wrapped in <React.StrictMode>, what is logged when the component above mounts?',
      code: `function Mount() {
  useEffect(() => {
    console.log('mounted');
    return () => console.log('cleanup');
  }, []);
  return null;
}`,
      codeLang: 'javascript',
      options: [
        'mounted',
        'mounted, cleanup, mounted',
        'cleanup, mounted',
        'Nothing, effects are disabled in StrictMode',
      ],
      correctIndex: 1, points: 1,
      explanation: 'React 18 StrictMode mounts, unmounts and remounts once in development to check that your cleanup is correct. Production runs the effect once.|||StrictMode của React 18 ở môi trường dev gắn, gỡ rồi gắn lại một lần để kiểm cleanup có đúng không. Bản production chỉ chạy effect một lần.',
    },
  ],
};

/**
 * Spread the correct letter evenly (A/B/C/D) without hand-editing 80 option lists: question i of a chapter has its
 * options ROTATED so the correct one lands on index (i + chapterOffset) % 4. Deterministic (same output every load),
 * multi-answer indexes are remapped the same way. Options never refer to each other by letter, so rotating is safe.
 */
const xoay = (q, target) => {
  const n = q.options.length;
  const shift = (q.correctIndex - (target % n) + n) % n;
  if (!shift) return q;
  const map = (i) => (i - shift + n) % n;
  return {
    ...q,
    options: q.options.map((_, j) => q.options[(j + shift) % n]),
    correctIndex: map(q.correctIndex),
    ...(q.correctIndexes ? { correctIndexes: q.correctIndexes.map(map).sort((a, b) => a - b) } : {}),
  };
};

export default Object.fromEntries(
  Object.entries(BANK).map(([k, qs], ci) => [k, qs.map((q, i) => xoay(q, i + ci))]),
);
