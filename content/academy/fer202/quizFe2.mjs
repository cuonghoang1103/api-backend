/**
 * FER202 · English FE-style MCQ bank (Ch9–Ch12, A1–A3) + comprehensive final mock (45) — appended by FER202.mjs.
 * Soạn 21/11/2026. Văn phong bắt chước câu FE thật của trường (xem fer202/chuaQuiz.mjs): đề + đáp án TIẾNG ANH,
 * giải thích song ngữ 'EN|||VI'. Mọi câu có `code` đã CHẠY THẬT để chốt đáp án (react 18.3, react-router-dom 6,
 * @reduxjs/toolkit 2, react-redux 9, RTL 16 + vitest/jsdom, axios, typescript 5 --strict). Câu Next.js dựa theo
 * tài liệu App Router (Next 13+), không chạy.
 * Định dạng câu = định dạng quiz sẵn có (scripts/academy-seed-course.mjs đọc question/options/correctIndex/points/
 * correctIndexes/code/codeLang/explanation). Không đặt `id` ⇒ seed tự đánh q<N> theo vị trí, nên câu mới NỐI SAU câu cũ.
 */

/**
 * q(question, options, correctIndex, explanation, extra?) — extra: { code, codeLang, correctIndexes }
 * LƯU Ý khi sửa: trong mã nguồn, `correctIndex` là vị trí đáp án đúng LÚC SOẠN. q() đổi chỗ (swap) đáp án đúng sang
 * một ô xoay vòng 2→0→3→1… để đáp án không dồn vào B — trừ câu nhiều đáp án và câu mà mọi lựa chọn đều là số
 * (giữ thứ tự tăng dần). Dữ liệu xuất ra (cái seed đọc) đã là vị trí cuối cùng; kiểm bằng import module.
 */
const XOAY = [2, 0, 3, 1, 3, 2, 0, 1];
let soCau = 0;
const q = (question, options, correctIndex, explanation, extra = {}) => {
  let opts = options, ci = correctIndex;
  const toanSo = options.every((o) => /^-?[\d.]+$/.test(o.trim()));
  if (!extra.correctIndexes && !toanSo && options.length === 4) {
    const dich = XOAY[soCau % XOAY.length];
    if (dich !== ci) { opts = [...options]; [opts[ci], opts[dich]] = [opts[dich], opts[ci]]; ci = dich; }
  }
  soCau++;
  return {
    question, options: opts, correctIndex: ci, points: 1, explanation,
    ...(extra.correctIndexes ? { correctIndexes: extra.correctIndexes } : {}),
    ...(extra.code ? { code: extra.code.trim(), codeLang: extra.codeLang || 'javascript' } : {}),
  };
};

/* ══════════════════════ CHAPTER 9 — React Router ══════════════════════ */
const ch9 = [
  q('What does the component render when the browser URL is /products/42?',
    ['Product 42 (number)', 'Product 42 (string)', 'Product :id (string)', 'Nothing, because the route does not match'],
    1,
    'useParams() returns every URL parameter as a STRING, so id is "42", not 42. Convert with Number(id) before comparing with numeric ids.|||useParams() luôn trả tham số URL dạng CHUỖI, nên id là "42" chứ không phải 42. So với id kiểu số thì phải Number(id) trước.',
    { code: `
import { Routes, Route, useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  return <p>Product {id} ({typeof id})</p>;
}

<Routes>
  <Route path="/products/:id" element={<ProductDetail />} />
</Routes>` }),
  q('After a successful login you want to go to /dashboard so that the Back button does NOT return to the login page. Which code is correct in React Router v6?',
    ['const navigate = useNavigate(); navigate("/dashboard", { replace: true });', 'window.location.href = "/dashboard";', 'const history = useHistory(); history.push("/dashboard");', 'return <Link to="/dashboard" replace />;'],
    0,
    'useNavigate() returns a navigate function; { replace: true } replaces the current history entry. useHistory is v5 only, window.location reloads the whole app, and a Link only navigates when clicked.|||useNavigate() trả về hàm navigate; { replace: true } thay mục lịch sử hiện tại. useHistory chỉ có ở v5, window.location tải lại cả app, còn Link chỉ chuyển trang khi được bấm.'),
  q('The URL is /dashboard/settings. What is displayed?',
    ['Only "Dashboard"', 'Only "Settings"', '"Dashboard" followed by "Settings"', '"Overview" followed by "Settings"'],
    2,
    'The parent route renders its layout (Dashboard) and the matching child route is rendered where <Outlet /> is placed. The index route is used only for exactly /dashboard.|||Route cha render layout (Dashboard), route con khớp được render đúng chỗ đặt <Outlet />. Route index chỉ dùng khi URL đúng bằng /dashboard.',
    { code: `
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  );
}

<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<p>Overview</p>} />
    <Route path="settings" element={<p>Settings</p>} />
  </Route>
</Routes>` }),
  q('In React Router v6, what is the role of the <Outlet /> component?',
    ['It opens a link in a new browser tab', 'It marks the place in a parent route element where the matching child route is rendered', 'It redirects the user to the 404 page', 'It lazy-loads the next page in the background'],
    1,
    'Nested routes render inside their parent through <Outlet />. If the parent element forgets the Outlet, the child route matches but nothing of it appears on screen.|||Route lồng nhau hiện bên trong route cha qua <Outlet />. Quên đặt Outlet thì route con vẫn khớp nhưng không hiện gì lên màn hình.'),
  q('The URL is /courses?sort=price&page=2. What does the console.log print?',
    ['2 number undefined', '2 string null', 'page=2 string null', 'undefined undefined null'],
    1,
    'URLSearchParams.get() returns the value as a string ("2"), and null (not undefined) for a key that is not in the query string.|||URLSearchParams.get() trả giá trị dạng chuỗi ("2"), và trả null (không phải undefined) với khoá không có trên query string.',
    { code: `
import { useSearchParams } from "react-router-dom";

function Courses() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const q = searchParams.get("q");
  console.log(page, typeof page, q);
  return null;
}` }),
  q('Which route definition shows a "Not Found" page for every URL that matches no other route?',
    ['<Route path="*" element={<NotFound />} />', '<Route path="/404" element={<NotFound />} />', '<Route exact path="/" element={<NotFound />} />', '<Route path="?" element={<NotFound />} />'],
    0,
    'path="*" is the catch-all route in v6; it has the lowest rank, so it only wins when nothing else matches.|||path="*" là route bắt-mọi-thứ ở v6; nó có hạng thấp nhất nên chỉ thắng khi không route nào khác khớp.'),
  q('Why do you no longer need the exact prop on <Route> in React Router v6?',
    ['Because exact was renamed to strict', 'Because <Routes> ranks routes and matches the whole path by default, picking the best match', 'Because v6 only allows one route per application', 'Because the first route declared always wins'],
    1,
    'In v6, <Routes> (which replaced <Switch>) chooses the most specific route, and a path like "/" no longer matches "/about". exact was removed.|||Ở v6, <Routes> (thay cho <Switch>) chọn route cụ thể nhất, và path "/" không còn khớp "/about" nữa. Prop exact đã bị bỏ.'),
  q('The current URL is /about. What is the className of the "About" link?',
    ['selected', 'active', 'nav-link-active', 'No class is added automatically'],
    1,
    'NavLink automatically adds the class "active" when its to matches the current location, which is handy for highlighting the current menu item.|||NavLink tự gắn class "active" khi to khớp URL hiện tại — tiện để tô sáng mục menu đang mở.',
    { code: `
<MemoryRouter initialEntries={["/about"]}>
  <NavLink to="/about">About</NavLink>
  <NavLink to="/contact">Contact</NavLink>
</MemoryRouter>` }),
  q('How do you define a route for /users/7/posts/3 and read both values in the component?',
    ['path="/users/{userId}/posts/{postId}" and const { userId, postId } = useParams();', 'path="/users/:userId&:postId" and const params = useParams("userId", "postId");', 'path="/users/:userId/posts/:postId" and const { userId, postId } = useParams();', 'path="/users/*/posts/*" and const [userId, postId] = useParams();'],
    2,
    'Each dynamic segment starts with a colon; useParams() returns one object with a key per segment.|||Mỗi đoạn động bắt đầu bằng dấu hai chấm; useParams() trả về một object, mỗi đoạn là một khoá.'),
  q('Which component must wrap the application so that <Routes>, <Link> and useNavigate work in a normal browser app?',
    ['<BrowserRouter>', '<Switch>', '<Provider>', '<Suspense>'],
    0,
    'BrowserRouter keeps the UI in sync with the browser URL using the History API. Using Link or useNavigate outside a router throws an error.|||BrowserRouter giữ UI khớp với URL trình duyệt bằng History API. Dùng Link hay useNavigate ngoài router sẽ báo lỗi.'),
];

/* ══════════════════════ CHAPTER 10 — lazy & Suspense ══════════════════════ */
const ch10 = [
  q('Chart.jsx only contains "export function Chart() { ... }". What happens when <Chart /> is rendered?',
    ['It renders normally after loading', 'React throws an error, because React.lazy expects the module to have a default export that is a component', 'The Suspense fallback is shown forever with no error', 'Vite refuses to build the project'],
    1,
    'React.lazy resolves the promise and reads module.default. A module with only a named export has no default, so rendering fails with an error.|||React.lazy đợi promise rồi đọc module.default. Module chỉ có named export thì không có default, nên render báo lỗi.',
    { code: `
import { lazy, Suspense } from "react";
const Chart = lazy(() => import("./Chart.jsx"));

<Suspense fallback={<p>Loading...</p>}>
  <Chart />
</Suspense>` }),
  q('How do you lazy-load a component that is exported with a NAMED export (export function Chart)?',
    ['lazy(() => import("./Chart").Chart)', 'lazy(import("./Chart"), "Chart")', 'lazy(() => import("./Chart").then(m => ({ default: m.Chart })))', 'It is impossible; you must rewrite the file'],
    2,
    'Map the named export to a default field inside the promise; lazy only needs a promise resolving to { default: Component }.|||Đổi named export thành trường default ngay trong promise; lazy chỉ cần một promise trả về { default: Component }.'),
  q('While Slow is still loading, what is displayed?',
    ['Only "Outer"', '"Page" and "Inner"', 'Nothing until Slow has loaded', '"Page", "Inner" and "Outer"'],
    1,
    'A suspending component is handled by the NEAREST Suspense boundary above it. Everything outside that boundary (the h1) stays visible.|||Component đang "treo" được xử lý bởi Suspense GẦN NHẤT phía trên nó. Phần ngoài ranh giới đó (thẻ h1) vẫn hiển thị.',
    { code: `
const Slow = lazy(() => import("./Slow.jsx"));

<Suspense fallback={<p>Outer</p>}>
  <h1>Page</h1>
  <Suspense fallback={<p>Inner</p>}>
    <Slow />
  </Suspense>
</Suspense>` }),
  q('A lazy chunk fails to download because the network is down. What can catch this error and show a friendly message?',
    ['The Suspense fallback', 'An Error Boundary component placed above the lazy component', 'A try/catch around the lazy() call', 'A useEffect in the parent component'],
    1,
    'Suspense only handles the loading state. A rejected import is a render error, which only an Error Boundary (getDerivedStateFromError / componentDidCatch) can catch.|||Suspense chỉ lo trạng thái đang tải. Import bị lỗi là lỗi khi render, chỉ Error Boundary (getDerivedStateFromError / componentDidCatch) bắt được.'),
  q('Where should React.lazy() normally be called?',
    ['Inside the component body, so it re-runs on every render', 'Inside useEffect', 'At the top level of a module, outside any component', 'Inside the Suspense fallback'],
    2,
    'Declaring lazy inside a component creates a new component type on every render, so React remounts it and its state is lost. Declare it once at module level.|||Khai báo lazy bên trong component sẽ tạo kiểu component mới mỗi lần render, React gắn lại từ đầu và mất state. Khai báo một lần ở cấp module.'),
  q('In a single-page application, where is code splitting usually most effective?',
    ['At the route (page) level', 'Around every button', 'Inside reducers', 'In CSS files only'],
    0,
    'Users only need the code of the page they are visiting, so making each page a lazy component gives the biggest bundle saving with few extra requests.|||Người dùng chỉ cần code của trang đang xem, nên mỗi trang là một lazy component sẽ giảm bundle nhiều nhất mà ít request thêm.'),
  q('What does a bundler such as Vite or webpack do when it sees import("./Page.jsx") with parentheses?',
    ['It inlines Page.jsx into the main bundle', 'It emits a separate chunk that is downloaded only when the import() runs', 'It ignores the file', 'It converts the file to TypeScript'],
    1,
    'Dynamic import() is a split point: the bundler puts that module in its own chunk and loads it on demand at runtime.|||import() động là điểm tách: bộ đóng gói đặt module đó vào chunk riêng và tải khi cần lúc chạy.'),
  q('Which value can be passed to the fallback prop of Suspense?',
    ['Only a string', 'Only a component type such as Spinner (without < />)', 'Any React node, for example <Spinner />, a string or null', 'A Promise'],
    2,
    'fallback accepts any renderable React node: an element like <Spinner />, text, or null.|||fallback nhận mọi React node render được: phần tử như <Spinner />, chữ, hoặc null.'),
  q('The user opens /about for the first time. What do they see?',
    ['The About page immediately, with no loading state', '"Loading page..." first, then the About page once its chunk arrives', 'A blank page forever', 'An error because Routes cannot be inside Suspense'],
    1,
    'On the first visit the About chunk is not downloaded yet, so the surrounding Suspense shows its fallback; once loaded, About replaces it. Later visits use the cached chunk.|||Lần đầu chunk About chưa tải nên Suspense bao ngoài hiện fallback; tải xong thì About thay vào. Lần sau dùng chunk đã có.',
    { code: `
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));

<BrowserRouter>
  <Suspense fallback={<p>Loading page...</p>}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </Suspense>
</BrowserRouter>` }),
  q('What is the main drawback of splitting an app into too many tiny lazy components?',
    ['The app can no longer use hooks', 'Many extra network requests and loading flickers, which can make the app feel slower', 'Lazy components cannot receive props', 'The bundle becomes larger than without splitting'],
    1,
    'Each lazy component is a separate request with its own loading state; over-splitting trades one big download for many small waits.|||Mỗi lazy component là một request riêng kèm trạng thái tải; tách quá vụn là đổi một lần tải lớn lấy rất nhiều lần chờ nhỏ.'),
];

/* ══════════════════════ CHAPTER 11 — Client-server ══════════════════════ */
const ch11 = [
  q('The server answers GET /products/999 with status 404 and the body {}. What is printed?',
    ['Error', 'Data: {}', 'Nothing is printed', 'An uncaught exception'],
    1,
    'fetch only rejects on network failure. A 404 is still a resolved Response, so .then runs and r.json() parses the body {}.|||fetch chỉ reject khi lỗi mạng. 404 vẫn là Response resolve bình thường, nên .then chạy và r.json() đọc được body {}.',
    { code: `
fetch("http://localhost:9999/products/999")
  .then((r) => r.json())
  .then((d) => console.log("Data:", JSON.stringify(d)))
  .catch(() => console.log("Error"));` }),
  q('How do you make fetch treat a 404 or 500 response as an error?',
    ['fetch(url, { strict: true })', 'Check response.ok (or response.status) and throw an Error when it is false', 'Wrap fetch in Suspense', 'Use response.text() instead of response.json()'],
    1,
    'response.ok is true only for 2xx statuses. Throwing when it is false sends the flow to .catch / the catch block.|||response.ok chỉ true với mã 2xx. Ném lỗi khi nó false thì luồng sẽ rơi vào .catch / khối catch.'),
  q('The server returns 404 for this URL. What is printed?',
    ['then undefined', 'catch 404', 'then 404', 'catch undefined'],
    1,
    'axios rejects for any status outside 2xx; the error object carries the server answer in error.response (status, data).|||axios reject với mọi mã ngoài 2xx; object lỗi mang câu trả lời của server ở error.response (status, data).',
    { code: `
try {
  const res = await axios.get("http://localhost:9999/products/999");
  console.log("then", res.status);
} catch (err) {
  console.log("catch", err.response.status);
}` }),
  q('Two of the three requests succeed and one fails. What is printed?',
    ['then [1, 3]', 'catch x', 'then [1, undefined, 3]', 'Nothing is printed'],
    1,
    'Promise.all rejects as soon as ANY promise rejects, so .then is skipped and .catch receives that first error. Use Promise.allSettled when you need every result even if some fail.|||Promise.all reject ngay khi BẤT KỲ promise nào reject, nên .then bị bỏ qua và .catch nhận lỗi đầu tiên đó. Cần đủ mọi kết quả kể cả khi có cái lỗi thì dùng Promise.allSettled.',
    { code: `
Promise.all([
  Promise.resolve(1),
  Promise.reject(new Error("x")),
  Promise.resolve(3),
])
  .then((values) => console.log("then", values))
  .catch((e) => console.log("catch", e.message));` }),
  q('What is the output?',
    ['1 2 3', '1 3 2', '3 1 2', '2 1 3'],
    1,
    'load() runs synchronously until the first await, so "1" prints; await pauses load and the caller continues ("3"); then load resumes and prints "2".|||load() chạy đồng bộ tới await đầu tiên nên in "1"; await tạm dừng load, nơi gọi chạy tiếp ("3"); rồi load chạy lại và in "2".',
    { code: `
async function load() {
  console.log("1");
  const v = await Promise.resolve("2");
  console.log(v);
}
load();
console.log("3");` }),
  q('Which HTTP status code does a REST API (json-server included) return when a POST successfully creates a new resource?',
    ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
    1,
    '201 Created means the resource was created; the response body usually contains the new record with its id.|||201 Created nghĩa là bản ghi đã được tạo; body thường chứa bản ghi mới kèm id.'),
  q('You only want to change the status field of order 5 without sending its other fields. Which request should you send?',
    ['PUT /orders/5 with { "status": "Shipped" }', 'POST /orders with { "id": 5, "status": "Shipped" }', 'GET /orders/5?status=Shipped', 'PATCH /orders/5 with { "status": "Shipped" }'],
    3,
    'PATCH merges the sent fields into the record. PUT replaces the whole record, so the other fields would be lost.|||PATCH gộp các trường gửi lên vào bản ghi. PUT thay cả bản ghi nên các trường khác sẽ mất.'),
  q('What is the above command used for?',
    ['To compile db.json into JavaScript', 'To start a fake REST API from db.json on port 9999 and reload when the file changes', 'To deploy db.json to a cloud database', 'To validate the JSON syntax of db.json only'],
    1,
    'json-server turns each top-level key of db.json into REST routes (GET/POST/PUT/PATCH/DELETE); --watch reloads on change and --port picks the port.|||json-server biến mỗi khoá cấp gốc của db.json thành các route REST (GET/POST/PUT/PATCH/DELETE); --watch nạp lại khi file đổi, --port chọn cổng.',
    { code: 'npx json-server --watch db.json --port 9999', codeLang: 'bash' }),
  q('db.json has a "products" array. Which request returns only the products whose categoryId is 2?',
    ['GET /products/2', 'GET /products?categoryId=2', 'POST /products/filter with { "categoryId": 2 }', 'GET /products#categoryId=2'],
    1,
    'json-server filters by query string: ?field=value. /products/2 returns the single product whose id is 2.|||json-server lọc theo query string: ?trường=giá-trị. /products/2 là lấy MỘT sản phẩm có id bằng 2.'),
  q('Which of the following is a valid JSON text?',
    ["{ name: 'Ann' }", '{ "name": "Ann", "age": 20 }', '{ "name": "Ann", }', "{ 'name': \"Ann\" }"],
    1,
    'JSON requires double-quoted keys and strings and forbids trailing commas and single quotes.|||JSON bắt buộc khoá và chuỗi dùng nháy kép, cấm dấu phẩy thừa ở cuối và nháy đơn.'),
];

/* ══════════════════════ CHAPTER 12 — Flux & Redux ══════════════════════ */
const ch12 = [
  q('What is store.getState().count after the three dispatches?',
    ['0', '1', '2', 'An error is thrown for the unknown action "reset"'],
    2,
    'An action the reducer does not handle falls into default and returns the current state unchanged, so only the two increments count.|||Action mà reducer không xử lý rơi vào default và trả nguyên state, nên chỉ hai lần increment có tác dụng.',
    { code: `
function counter(state = { count: 0 }, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}
const store = createStore(counter);
store.dispatch({ type: "increment" });
store.dispatch({ type: "reset" });
store.dispatch({ type: "increment" });` }),
  q('The button is clicked twice. What does the UI show?',
    ['2, the store and the UI are in sync', '0, even though state.count in the store is 2', 'An error is thrown on the first click', '1'],
    1,
    'The reducer mutates the old object and returns the SAME reference. useSelector compares references, sees no change and does not re-render. Return a new object instead.|||Reducer sửa object cũ rồi trả về CÙNG tham chiếu. useSelector so tham chiếu, thấy không đổi nên không render lại. Phải trả về object mới.',
    { code: `
function counter(state = { count: 0 }, action) {
  if (action.type === "inc") {
    state.count++;
    return state;
  }
  return state;
}
function Counter() {
  const state = useSelector((s) => s);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch({ type: "inc" })}>{state.count}</button>;
}` }),
  q('What does store.getState() return?',
    ['[ [], null ]', '{ "cart": [], "user": null }', '{ "reducer": { "cart": [], "user": null } }', 'undefined until the first action is dispatched'],
    1,
    'combineReducers builds one state object whose keys are the keys you passed; each slice starts from its reducer default.|||combineReducers tạo một object state có khoá đúng như khoá bạn truyền; mỗi phần bắt đầu từ giá trị mặc định của reducer tương ứng.',
    { code: `
const cart = (state = [], action) => state;
const user = (state = null, action) => state;
const store = createStore(combineReducers({ cart, user }));
console.log(JSON.stringify(store.getState()));` }),
  q('What does todosSlice.actions.added("Learn") return?',
    ['"Learn"', '{ type: "added", value: "Learn" }', '{ type: "todos/added", payload: "Learn" }', 'A function that must be called with dispatch'],
    2,
    'createSlice generates action creators; the type is "<slice name>/<reducer name>" and the argument becomes action.payload.|||createSlice sinh sẵn action creator; type là "<tên slice>/<tên reducer>" và đối số trở thành action.payload.',
    { code: `
const todosSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    added: (state, action) => { state.push(action.payload); },
  },
});` }),
  q('Which action types reach the reducers when the request succeeds?',
    ['products/fetch only', 'products/fetch/pending, then products/fetch/fulfilled', 'products/fetch/start, then products/fetch/success', 'products/fetch/pending, then products/fetch/rejected'],
    1,
    'createAsyncThunk dispatches pending before the async function runs, then fulfilled with the returned value (or rejected if it throws).|||createAsyncThunk dispatch pending trước khi hàm async chạy, rồi fulfilled kèm giá trị trả về (hoặc rejected nếu hàm ném lỗi).',
    { code: `
const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await axios.get("http://localhost:9999/products");
  return res.data;
});
await store.dispatch(fetchProducts());` }),
  q('Which statement about Redux Toolkit createSlice is true?',
    ['You must write the action type strings by hand', 'It generates action creators from the reducer names, and lets you write "mutating" code that Immer turns into immutable updates', 'It replaces the need for a store', 'It can only hold one reducer'],
    1,
    'createSlice = name + initialState + reducers. It generates actions automatically and uses Immer, so state.items.push(x) is safe inside it.|||createSlice = name + initialState + reducers. Nó tự sinh action và dùng Immer, nên viết state.items.push(x) bên trong là an toàn.'),
  q('What happens when this action is dispatched?',
    ['The state becomes { v: 2 }', 'The state becomes { v: 1 }', 'Immer throws an error, because the reducer both modified the draft and returned a new value', 'The return value is silently ignored'],
    2,
    'In an RTK reducer you either mutate the draft OR return a new state, never both. Doing both makes Immer throw.|||Trong reducer của RTK, hoặc sửa draft HOẶC trả state mới, không bao giờ cả hai. Làm cả hai thì Immer ném lỗi.',
    { code: `
const slice = createSlice({
  name: "w",
  initialState: { v: 0 },
  reducers: {
    x: (state) => {
      state.v = 1;
      return { v: 2 };
    },
  },
});
store.dispatch(slice.actions.x());` }),
  q('Which list states the three principles of Redux?',
    ['One store per component; state is mutable; reducers may call APIs', 'Single source of truth; state is read-only and changes only by dispatching actions; changes are made with pure reducer functions', 'Two-way data binding; observers; controllers', 'Components own all state; context replaces the store; actions are optional'],
    1,
    'One store holds the whole state, the only way to change it is to dispatch an action, and pure reducers compute the next state.|||Một store giữ toàn bộ state, muốn đổi chỉ có cách dispatch action, và reducer thuần tính ra state mới.'),
  q('What is the role of a selector such as (state) => state.cart.items.length?',
    ['It sends an action to the store', 'It reads or derives a piece of data from the store state, typically passed to useSelector', 'It registers a middleware', 'It resets the store'],
    1,
    'Selectors are pure functions from state to data; useSelector runs them and re-renders the component when the selected value changes.|||Selector là hàm thuần từ state ra dữ liệu; useSelector chạy nó và render lại component khi giá trị chọn ra thay đổi.'),
  q('In the Flux architecture, which part receives every action and forwards it to the stores?',
    ['The View', 'The Dispatcher', 'The Controller', 'The Model'],
    1,
    'Flux flows one way: Action → Dispatcher → Store → View. The Dispatcher is the central hub that sends each action to the registered stores.|||Flux chảy một chiều: Action → Dispatcher → Store → View. Dispatcher là trạm trung tâm chuyển mỗi action tới các store đã đăng ký.'),
];

/* ══════════════════════ ADVANCED A1 — Performance ══════════════════════ */
const a1 = [
  q('The "+" button is clicked twice. How many times does Child render in total (including the first render)?',
    ['1', '2', '3', '0'],
    2,
    'A new { color: "red" } object is created on every Parent render, so React.memo sees a changed prop each time and re-renders Child.|||Mỗi lần Parent render lại tạo object { color: "red" } mới, nên React.memo thấy prop đổi và render lại Child mỗi lần.',
    { code: `
const Child = React.memo(function Child({ style }) {
  console.log("Child render");
  return <p style={style}>child</p>;
});

function Parent() {
  const [n, setN] = useState(0);
  return (
    <>
      <button onClick={() => setN(n + 1)}>+</button>
      <Child style={{ color: "red" }} />
    </>
  );
}` }),
  q('Child is wrapped in React.memo and Parent renders <Child style={{ color: "red" }} />, so Child re-renders every time Parent does. Which change makes Child render only once?',
    ['Wrap Child in useEffect', 'Create the style object once, e.g. const style = useMemo(() => ({ color: "red" }), []), or move it outside the component', 'Add key={n} to Child', 'Wrap the button handler in useCallback'],
    1,
    'React.memo compares props shallowly; a stable object reference (useMemo or a module-level constant) keeps the props equal between renders.|||React.memo so sánh nông props; tham chiếu ổn định (useMemo hoặc hằng ở cấp module) giữ props bằng nhau giữa các lần render.'),
  q('The user clicks "inc" three times, then "show". What is pushed into log?',
    ['3', '0', 'undefined', 'An error is thrown'],
    1,
    'useCallback with an empty dependency array keeps the FIRST function, which closed over count = 0 (a stale closure). Add [count] to the dependencies.|||useCallback với mảng phụ thuộc rỗng giữ hàm ĐẦU TIÊN, hàm đó nhớ count = 0 (stale closure). Thêm [count] vào phụ thuộc.',
    { code: `
function Parent() {
  const [count, setCount] = useState(0);
  const show = useCallback(() => log.push(count), []);
  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>inc</button>
      <button onClick={show}>show</button>
    </>
  );
}` }),
  q('The user clicks "b" twice, then "a" once. How many times does the useMemo callback run in total?',
    ['1', '2', '3', '4'],
    1,
    'useMemo recomputes only when a dependency changes: once on mount and once when a changes. Changing b reuses the cached value.|||useMemo chỉ tính lại khi phụ thuộc đổi: một lần lúc mount và một lần khi a đổi. Đổi b thì dùng lại giá trị đã nhớ.',
    { code: `
function Calc() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const square = useMemo(() => {
    console.log("compute");
    return a * a;
  }, [a]);
  return (
    <>
      <button onClick={() => setB(b + 1)}>b</button>
      <button onClick={() => setA(a + 1)}>a</button>
      <p>{square}</p>
    </>
  );
}` }),
  q('The user types "A-note" into Ann\'s input and then clicks "remove first". What does Bob\'s input show?',
    ['An empty string', 'A-note', 'Bob', 'An error is thrown'],
    1,
    'With index keys, Bob moves to key 0 and React reuses the first Row instance, including its input state. Use a stable id (here the name) as the key.|||Dùng index làm key thì Bob chuyển sang key 0, React dùng lại Row đầu tiên kèm cả state ô nhập. Dùng id ổn định (ở đây là name) làm key.',
    { code: `
function Row({ name }) {
  const [note, setNote] = useState("");
  return <li>{name} <input value={note} onChange={(e) => setNote(e.target.value)} /></li>;
}
function List() {
  const [items, setItems] = useState(["Ann", "Bob", "Cat"]);
  return (
    <>
      <button onClick={() => setItems(items.slice(1))}>remove first</button>
      <ul>{items.map((n, i) => <Row key={i} name={n} />)}</ul>
    </>
  );
}` }),
  q('What is the difference between the render phase and the commit phase in React?',
    ['Render writes to the DOM, commit calls the components', 'Render calls your components to compute the new UI tree (it must be pure and may run more than once); commit applies the changes to the DOM and then runs effects', 'They are two names for the same thing', 'Commit happens only on the first render'],
    1,
    'Rendering is calculation; committing is the DOM update. A re-render does not always change the DOM: if the output is the same, commit touches nothing.|||Render là tính toán; commit là cập nhật DOM. Render lại chưa chắc đổi DOM: kết quả giống cũ thì commit không đụng gì.'),
  q('Which line calls heavy() on EVERY render of the component?',
    ['Line A only', 'Line B only', 'Both lines', 'Neither line'],
    0,
    'useState(heavy()) evaluates heavy() each render even though the result is ignored after the first; useState(() => heavy()) passes an initializer that React calls only once.|||useState(heavy()) gọi heavy() ở mọi lần render dù kết quả chỉ dùng lần đầu; useState(() => heavy()) truyền hàm khởi tạo nên React chỉ gọi một lần.',
    { code: `
function Report() {
  const [a, setA] = useState(heavy());        // Line A
  const [b, setB] = useState(() => heavy());  // Line B
  return <button onClick={() => setA(a + 1)}>x</button>;
}` }),
  q('Why does React call your components twice in development when the app is wrapped in <StrictMode>?',
    ['To make the production build faster', 'To help detect impure rendering and missing effect cleanups; it only happens in development', 'Because of a bug in React 18', 'To pre-load lazy components'],
    1,
    'StrictMode double-invokes rendering and re-runs effects (mount, cleanup, mount) in development so side effects in the wrong place show up early. Production renders once.|||StrictMode gọi render hai lần và chạy lại effect (mount, cleanup, mount) khi dev để lộ sớm side effect đặt sai chỗ. Bản production chỉ render một lần.'),
  q('Which tool shows which components re-rendered during an interaction and how long each render took?',
    ['The Network tab of Chrome DevTools', 'The React DevTools Profiler', 'console.time inside reducers', 'The Lighthouse SEO audit'],
    1,
    'Measure before optimising: the Profiler records commits and shows render time per component, so you only memoise what is really slow.|||Đo trước khi tối ưu: Profiler ghi lại từng lần commit và thời gian render của từng component, nhờ đó chỉ memo những chỗ thật sự chậm.'),
  q('(Choose 2 answers) Which techniques reduce rendering work for a list of 10,000 rows?',
    ['Virtualise the list (render only visible rows, e.g. react-window)', 'Use stable keys and wrap each Row in React.memo', 'Use the array index as key', 'Store the whole list in a context that changes on every keystroke'],
    0,
    'Virtualisation renders only what is on screen, and memoised rows with stable keys skip rows whose props did not change. Index keys and a frequently changing context make things worse.|||Ảo hoá chỉ render phần đang thấy, còn hàng được memo với key ổn định sẽ bỏ qua hàng không đổi props. Key là index và context đổi liên tục chỉ làm tệ hơn.',
    { correctIndexes: [0, 1] }),
];

/* ══════════════════════ ADVANCED A2 — Testing ══════════════════════ */
const a2 = [
  q('The rendered output is <p>Hello</p>. What happens when line 2 runs?',
    ['It returns null', 'It throws an error because no element matches', 'It returns undefined', 'It returns an empty array'],
    1,
    'getBy* queries throw when nothing (or more than one element) matches. queryBy* returns null instead, and findBy* returns a promise.|||Truy vấn getBy* ném lỗi khi không có (hoặc có nhiều hơn một) phần tử khớp. queryBy* thì trả null, còn findBy* trả về promise.',
    { code: `
render(<p>Hello</p>);
screen.getByText("Bye"); // line 2` }),
  q('Which assertion correctly checks that an error message is NOT in the document?',
    ['expect(screen.getByText("Invalid email")).toBeNull()', 'expect(screen.queryByText("Invalid email")).not.toBeInTheDocument()', 'expect(screen.findByText("Invalid email")).toBeFalsy()', 'expect(screen.getAllByText("Invalid email")).toHaveLength(0)'],
    1,
    'Use queryBy* for absence: it returns null instead of throwing. getBy*/getAllBy* would throw before the assertion runs, and findBy* returns a promise (always truthy).|||Kiểm "không có" thì dùng queryBy*: nó trả null chứ không ném lỗi. getBy*/getAllBy* ném lỗi trước khi kịp kiểm, còn findBy* trả promise (luôn truthy).'),
  q('User shows "Loading" and sets the name to "Ann" 50 ms later. Which assertion passes?',
    ['expect(screen.getByText("Ann")).toBeInTheDocument();', 'expect(screen.queryByText("Ann")).toBeInTheDocument();', 'expect(await screen.findByText("Ann")).toBeInTheDocument();', 'expect(screen.findByText("Ann")).toBeInTheDocument();'],
    2,
    'findBy* returns a promise that retries until the element appears (default timeout 1000 ms), so it must be awaited. getBy/queryBy check only once, immediately.|||findBy* trả promise và thử lại tới khi phần tử xuất hiện (mặc định chờ 1000 ms), nên phải await. getBy/queryBy chỉ kiểm một lần, ngay lập tức.',
    { code: `
function User() {
  const [name, setName] = useState(null);
  useEffect(() => { setTimeout(() => setName("Ann"), 50); }, []);
  return <p>{name ?? "Loading"}</p>;
}
render(<User />);` }),
  q('The first assertion fails. Which matcher should you use for this check?',
    ['toEqual(0.3)', 'toBeCloseTo(0.3)', 'toStrictEqual(0.3)', 'toBeTruthy()'],
    1,
    '0.1 + 0.2 is 0.30000000000000004 in floating point. toBeCloseTo compares numbers with a tolerance.|||0.1 + 0.2 bằng 0.30000000000000004 do số thực dấu phẩy động. toBeCloseTo so sánh số có sai số cho phép.',
    { code: `
test("adds prices", () => {
  expect(0.1 + 0.2).toBe(0.3);
});` }),
  q('Which assertion passes?',
    ['expect({ a: 1 }).toBe({ a: 1 })', 'expect({ a: 1 }).toEqual({ a: 1 })', 'expect([1, 2]).toEqual([2, 1])', 'All of them'],
    1,
    'toBe uses Object.is (same reference), so two separate objects are never toBe-equal. toEqual compares contents recursively, and array order matters.|||toBe dùng Object.is (cùng tham chiếu) nên hai object khác nhau không bao giờ toBe bằng nhau. toEqual so nội dung đệ quy, và thứ tự mảng có ý nghĩa.'),
  q('After clicking Save, which assertion verifies that onSave was called with the right argument?',
    ['expect(onSave).toBe({ id: 1 })', 'expect(onSave()).toEqual({ id: 1 })', 'expect(onSave).toHaveBeenCalledWith({ id: 1 })', 'expect(onSave.called).toBe(true)'],
    2,
    'vi.fn() / jest.fn() records every call; toHaveBeenCalledWith checks the arguments and toHaveBeenCalledTimes checks the count.|||vi.fn() / jest.fn() ghi lại mọi lần gọi; toHaveBeenCalledWith kiểm đối số, toHaveBeenCalledTimes kiểm số lần.',
    { code: `
function SaveButton({ onSave }) {
  return <button onClick={() => onSave({ id: 1 })}>Save</button>;
}
const onSave = vi.fn();
render(<SaveButton onSave={onSave} />);
await userEvent.click(screen.getByRole("button", { name: "Save" }));` }),
  q('Which query finds the input through its visible label, the way a user would?',
    ['screen.getByLabelText("Username")', 'screen.getByTestId("u")', 'screen.getByClassName("form-control")', 'document.querySelector("#u")'],
    0,
    'getByLabelText uses the label/htmlFor link, which also proves the form is accessible. getByTestId needs a data-testid attribute and there is no getByClassName in RTL.|||getByLabelText dựa vào liên kết label/htmlFor, đồng thời chứng minh form dễ tiếp cận. getByTestId cần thuộc tính data-testid, còn RTL không có getByClassName.',
    { code: `
<form>
  <label htmlFor="u">Username</label>
  <input id="u" className="form-control" />
</form>` }),
  q('Why is userEvent generally preferred over fireEvent in React Testing Library?',
    ['It runs tests in parallel', 'It simulates the full sequence a real user triggers (focus, key down, input, key up, click…) instead of dispatching a single DOM event', 'It does not need a DOM', 'It automatically mocks fetch'],
    1,
    'userEvent.type fires all the events of real typing, so bugs that appear only with real interaction are caught. fireEvent dispatches exactly one event.|||userEvent.type phát đủ chuỗi sự kiện như gõ thật, nên bắt được lỗi chỉ xuất hiện khi tương tác thật. fireEvent chỉ phát đúng một sự kiện.'),
  q('A component loads products with fetch("/api/products") in useEffect. How do you test it without calling the real API?',
    ['Start the real backend before every test', 'Mock fetch, e.g. vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: async () => [...] }), then await findByText', 'Remove the useEffect while testing', 'Use getByText immediately after render'],
    1,
    'Mocking the network makes the test fast and deterministic; restore the spy afterwards (mockRestore). Libraries such as MSW mock at the network level.|||Giả lập mạng giúp test nhanh và luôn cho cùng kết quả; xong thì trả lại (mockRestore). Thư viện như MSW giả lập ở tầng mạng.'),
  q('Which environment must Vitest or Jest use so that render() from React Testing Library works?',
    ['node', 'jsdom (a browser-like DOM implemented in JavaScript)', 'edge-runtime', 'No environment is needed'],
    1,
    'render() mounts components into document.body, so the test runner needs a DOM: set environment: "jsdom" (Vitest) or testEnvironment: "jsdom" (Jest).|||render() gắn component vào document.body nên trình chạy test cần DOM: đặt environment: "jsdom" (Vitest) hoặc testEnvironment: "jsdom" (Jest).'),
];

/* ══════════════════════ ADVANCED A3 — TypeScript & Next.js ══════════════════════ */
const a3 = [
  q('Which line does TypeScript reject?',
    ['Line 1', 'Line 2', 'Both lines', 'Neither line'],
    1,
    'title is required in CardProps, so <Card /> is a compile error ("Property title is missing"). count is optional (?) and has a default value.|||title là bắt buộc trong CardProps nên <Card /> báo lỗi biên dịch ("thiếu thuộc tính title"). count có dấu ? nên không bắt buộc, lại có giá trị mặc định.',
    { codeLang: 'typescript', code: `
interface CardProps {
  title: string;
  count?: number;
}
function Card({ title, count = 0 }: CardProps) {
  return <h3>{title} ({count})</h3>;
}
const ok = <Card title="React" />;  // Line 1
const bad = <Card />;               // Line 2` }),
  q('What does TypeScript report for the last line?',
    ['Nothing, any string is accepted', 'Type "done" is not assignable to type Status', 'A runtime error when the line executes', 'A warning only in the browser console'],
    1,
    'A union of string literals allows only those exact values. The check happens at compile time, before the code runs.|||Union các chuỗi hằng chỉ cho đúng những giá trị đó. Lỗi được bắt lúc biên dịch, trước khi code chạy.',
    { codeLang: 'typescript', code: `
type Status = "idle" | "loading" | "success" | "error";
let status: Status = "idle";
status = "done";` }),
  q('With strict mode on, setItems(["a"]) is a compile error. Why, and what is the fix?',
    ['useState cannot hold arrays; use useRef', 'The type is inferred as never[] from the empty array; write useState<string[]>([])', 'Strings must be wrapped in String()', 'setItems only accepts functions'],
    1,
    'An empty array literal gives TypeScript nothing to infer, so the state type becomes never[]. Pass the generic explicitly: useState<string[]>([]).|||Mảng rỗng không cho TypeScript manh mối nào nên kiểu state thành never[]. Truyền generic rõ ràng: useState<string[]>([]).',
    { codeLang: 'typescript', code: `
const [items, setItems] = useState([]);
setItems(["a"]);` }),
  q('Which is the correct type for an input onChange handler in React with TypeScript?',
    ['(e: Event) => void', '(e: React.ChangeEvent<HTMLInputElement>) => void', '(e: InputEvent<string>) => void', '(e: React.MouseEvent<HTMLButtonElement>) => void'],
    1,
    'React passes a synthetic ChangeEvent; the generic tells TS the target is an HTMLInputElement, so e.target.value is typed as string.|||React truyền ChangeEvent tổng hợp; generic cho TS biết target là HTMLInputElement, nên e.target.value có kiểu string.'),
  q('Which line causes a compile error, and how should it be written?',
    ['Line 1; use u.email!', 'Line 2; "u.email is possibly undefined", write u.email?.length', 'Line 3; optional chaining is not allowed', 'No error'],
    1,
    'email is optional, so its type is string | undefined. Optional chaining returns undefined instead of crashing when email is missing.|||email là tuỳ chọn nên kiểu là string | undefined. Optional chaining trả undefined thay vì làm sập chương trình khi thiếu email.',
    { codeLang: 'typescript', code: `
interface User { id: number; name: string; email?: string }
const u: User = { id: 1, name: "Ann" };   // Line 1
const len = u.email.length;              // Line 2
const len2 = u.email?.length;            // Line 3` }),
  q('In the Next.js App Router, which file creates the route /products/:id?',
    ['pages/products/:id.tsx', 'app/products/[id]/page.tsx', 'app/products/id.tsx', 'routes.config.js'],
    1,
    'Next.js uses file-system routing: each folder is a URL segment, [id] is a dynamic segment, and page.tsx makes the segment publicly reachable.|||Next.js định tuyến theo thư mục: mỗi thư mục là một đoạn URL, [id] là đoạn động, và page.tsx làm đoạn đó truy cập được.'),
  q('A component in the Next.js App Router uses useState and an onClick handler. What must be added at the top of the file?',
    ['import "react-client";', 'The directive "use client";', 'export const dynamic = "force-static";', 'Nothing, every component is a client component'],
    1,
    'Components in the app directory are Server Components by default and cannot use state, effects or event handlers. "use client" marks the file as a Client Component.|||Component trong thư mục app mặc định là Server Component, không dùng được state, effect hay xử lý sự kiện. "use client" đánh dấu file là Client Component.'),
  q('Which Next.js rendering strategy builds the HTML once at build time and serves the same static page to every user?',
    ['Server-Side Rendering (SSR)', 'Static Site Generation (SSG)', 'Client-Side Rendering (CSR)', 'Hydration'],
    1,
    'SSG pre-renders at build time (very fast, CDN-friendly); SSR renders on the server for each request; CSR renders in the browser.|||SSG dựng sẵn lúc build (rất nhanh, hợp CDN); SSR dựng trên server ở mỗi request; CSR dựng trong trình duyệt.'),
  q('Which code navigates to /about in Next.js without a full page reload?',
    ['<a href="/about">About</a>', 'import { Link } from "react-router-dom"; <Link to="/about">About</Link>', 'import Link from "next/link"; <Link href="/about">About</Link>', 'window.location.assign("/about")'],
    2,
    'next/link performs client-side navigation and prefetches the target route. Note the prop is href (not to as in React Router).|||next/link chuyển trang phía client và tải trước route đích. Lưu ý prop là href (không phải to như React Router).'),
  q('In a Tailwind CSS v3 project, what is the purpose of the content array in tailwind.config.js?',
    ['It lists the CSS files to minify', 'It lists the files Tailwind scans for class names, so only the classes you actually use are generated', 'It defines the colour palette', 'It lists the npm packages to install'],
    1,
    'Tailwind generates CSS just for classes found in the content files; a wrong path means your classes produce no styles. (Tailwind v4 detects sources automatically.)|||Tailwind chỉ sinh CSS cho class tìm thấy trong các file content; khai sai đường dẫn là class không có style. (Tailwind v4 tự dò nguồn.)'),
];

/* ══════════════════════ COMPREHENSIVE FINAL MOCK — 45 questions ══════════════════════ */
const tongHop = [
  /* — Setup & ES6 (4) — */
  q('Which command creates a new React project with Vite?',
    ['npm install react-vite my-app', 'npm create vite@latest my-app -- --template react', 'npx react-scripts new my-app', 'node vite --react my-app'],
    1,
    'create vite scaffolds the project; --template react picks the React template. Then run npm install and npm run dev.|||create vite dựng khung dự án; --template react chọn mẫu React. Sau đó chạy npm install rồi npm run dev.'),
  q('What is printed?',
    ['Lan Hanoi undefined', 'Lan Hanoi student', 'undefined undefined student', 'A TypeError is thrown'],
    1,
    'Nested destructuring pulls city out of address, and a default value is used when the property is missing (role).|||Destructuring lồng lấy city ra từ address, và giá trị mặc định được dùng khi thuộc tính không có (role).',
    { code: `
const user = { name: "Lan", age: 20, address: { city: "Hanoi" } };
const { name, address: { city }, role = "student" } = user;
console.log(name, city, role);` }),
  q('What is printed?',
    ['Hanoi', 'HCM', 'undefined', 'A TypeError is thrown'],
    1,
    'Spread makes a SHALLOW copy: copy.address still points to the same nested object as user.address. Copy nested levels too ({ ...user, address: { ...user.address } }).|||Spread chỉ chép NÔNG: copy.address vẫn trỏ cùng object lồng với user.address. Phải chép cả tầng lồng ({ ...user, address: { ...user.address } }).',
    { code: `
const user = { name: "Lan", address: { city: "Hanoi" } };
const copy = { ...user };
copy.address.city = "HCM";
console.log(user.address.city);` }),
  q('What is printed?',
    ['[1, 2, 9, 10]', '[10, 9, 2, 1]', '[1, 10, 2, 9]', '[2, 1, 10, 9]'],
    2,
    'Without a comparator, sort converts elements to strings and compares them, so "10" comes before "2". Use sort((a, b) => a - b) for numbers.|||Không có hàm so sánh, sort đổi phần tử thành chuỗi rồi so, nên "10" đứng trước "2". Với số hãy dùng sort((a, b) => a - b).',
    { code: 'console.log([10, 9, 2, 1].sort());' }),

  /* — JSX (3) — */
  q('items is an empty array. What does the component render?',
    ['Nothing', 'The text "0"', 'The text "0 items"', 'false'],
    1,
    'items.length && ... evaluates to 0, and React renders the number 0 (it skips only false, null, undefined and true). Use items.length > 0 && ... instead.|||items.length && ... cho ra 0, và React vẫn in số 0 (chỉ bỏ qua false, null, undefined và true). Hãy viết items.length > 0 && ...',
    { code: `
function Cart({ items }) {
  return <div>{items.length && <span>{items.length} items</span>}</div>;
}` }),
  q('Which JSX is the correct conversion of <label for="email" class="form-label">Email</label><input type="email">?',
    ['<label for="email" class="form-label">Email</label><input type="email">', '<label htmlFor="email" className="form-label">Email</label><input type="email" />', '<label htmlFor="email" class="form-label">Email</label><input type="email"></input>', '<Label for="email" className="form-label">Email</Label><Input type="email" />'],
    1,
    'In JSX, for becomes htmlFor, class becomes className, and void elements such as input must be self-closed.|||Trong JSX, for thành htmlFor, class thành className, và thẻ rỗng như input phải tự đóng.'),
  q('What text is rendered?',
    ['LogoutfalsenullundefinedTrue', 'Login', 'Logintrue', 'Loginfalse'],
    1,
    'The ternary picks the Login span; false, null, undefined and true render nothing in JSX.|||Toán tử ba ngôi chọn span Login; false, null, undefined và true không hiện gì trong JSX.',
    { code: `
function Menu({ isLoggedIn }) {
  return (
    <nav>
      {isLoggedIn ? <span>Logout</span> : <span>Login</span>}
      {false}{null}{undefined}{true}
    </nav>
  );
}
<Menu isLoggedIn={false} />` }),

  /* — Bootstrap / Tailwind (3) — */
  q('In Bootstrap 5, which markup gives three columns that stack vertically on phones and sit side by side from the md breakpoint upwards?',
    ['<div class="row"><div class="col-4">…</div> ×3</div>', '<div class="row"><div class="col-md-4">…</div> ×3</div>', '<div class="col"><div class="row-md-4">…</div> ×3</div>', '<div class="flex-md-3">…</div>'],
    1,
    'col-md-4 means "4 of 12 columns from md (≥768 px) up"; below md each column takes the full width, so they stack. col-4 would stay three columns even on phones.|||col-md-4 nghĩa là "4/12 cột từ md (≥768 px) trở lên"; dưới md mỗi cột chiếm hết chiều ngang nên xếp chồng. col-4 thì vẫn ba cột kể cả trên điện thoại.'),
  q('Which React-Bootstrap component displays a dialog controlled by the show and onHide props?',
    ['<Toast>', '<Modal>', '<Accordion>', '<Popover>'],
    1,
    '<Modal show={open} onHide={() => setOpen(false)}> with Modal.Header / Modal.Body / Modal.Footer is the standard confirm dialog in PE exams.|||<Modal show={open} onHide={() => setOpen(false)}> kèm Modal.Header / Modal.Body / Modal.Footer là hộp thoại xác nhận chuẩn trong đề PE.'),
  q('What does the Tailwind class md:flex do?',
    ['Makes the element flex only on screens smaller than md', 'Applies display: flex from the md breakpoint (min-width 768px) upwards', 'Adds a medium flex-grow', 'Has no effect without a media query in CSS'],
    1,
    'Tailwind is mobile-first: an unprefixed utility applies everywhere, and md: applies it from that breakpoint up.|||Tailwind theo hướng mobile-first: class không tiền tố áp mọi nơi, còn md: áp từ mốc đó trở lên.'),

  /* — Components, props, PropTypes (5) — */
  q('What happens when <Age age="20" /> is rendered in development?',
    ['The component fails to render', 'It renders "20" and React logs a "Failed prop type" warning in the console', 'The string is converted to the number 20 automatically', 'TypeScript stops the build'],
    1,
    'PropTypes only warn in the console during development; they never block rendering and are skipped in production.|||PropTypes chỉ cảnh báo trên console khi dev; không bao giờ chặn render và bị bỏ qua ở production.',
    { code: `
function Age({ age }) { return <p>{age}</p>; }
Age.propTypes = { age: PropTypes.number.isRequired };` }),
  q('What are the className and text of the rendered button?',
    ['"btn btn-undefined" and "Save"', '"btn btn-primary" and "Save"', '"btn btn-primary" and "Click"', 'An error, because variant was not passed'],
    1,
    'Default parameter values in destructuring are the modern replacement for defaultProps on function components.|||Giá trị mặc định trong destructuring là cách hiện đại thay cho defaultProps ở function component.',
    { code: `
function Btn({ label = "Click", variant = "primary" }) {
  return <button className={"btn btn-" + variant}>{label}</button>;
}
<Btn label="Save" />` }),
  q('What text does this render?',
    ['T', 'Body', 'TBody', 'Nothing, children must be passed as a prop called content'],
    2,
    'Whatever is placed between the opening and closing tags arrives as props.children, which enables composition (Card, Layout, Modal…).|||Mọi thứ đặt giữa thẻ mở và thẻ đóng được truyền vào props.children — nền của composition (Card, Layout, Modal…).',
    { code: `
function Card({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>;
}
<Card title="T"><p>Body</p></Card>` }),
  q('Which statement about props is true?',
    ['A child component may modify its props to update the parent', 'Props are read-only inputs passed from parent to child; to change data the parent passes a callback function', 'Props can only be strings', 'Props are stored in the Redux store automatically'],
    1,
    'Data flows down through props and events flow up through callbacks (e.g. onDelete={handleDelete}). Mutating props breaks this one-way flow.|||Dữ liệu đi xuống qua props, sự kiện đi lên qua hàm callback (vd onDelete={handleDelete}). Sửa props phá vỡ luồng một chiều này.'),
  q('Which PropTypes declaration requires items to be an array of numbers?',
    ['items: PropTypes.array(PropTypes.number)', 'items: PropTypes.arrayOf(PropTypes.number).isRequired', 'items: PropTypes.number[]', 'items: [PropTypes.number]'],
    1,
    'arrayOf(type) validates every element; .isRequired also warns when the prop is missing.|||arrayOf(kiểu) kiểm từng phần tử; .isRequired cảnh báo thêm khi thiếu prop.'),

  /* — Events (3) — */
  q('The user clicks the button twice. How many times has handle run in total?',
    ['0', '1', '2', '3'],
    1,
    'onClick={handle()} CALLS handle during render and passes its return value (undefined) as the handler, so clicks do nothing. Write onClick={handle}.|||onClick={handle()} GỌI handle ngay lúc render và truyền kết quả (undefined) làm handler, nên bấm không có tác dụng. Hãy viết onClick={handle}.',
    { code: `
function Go() {
  const handle = () => console.log("clicked");
  return <button onClick={handle()}>Go</button>;
}` }),
  q('How do you pass the id of an item to a remove handler when its button is clicked?',
    ['<button onClick={remove(item.id)}>', '<button onClick={() => remove(item.id)}>', '<button onClick="remove(item.id)">', '<button onclick={remove} id={item.id}>'],
    1,
    'Wrap the call in an arrow function so it runs only on click; remove.bind(null, item.id) also works.|||Bọc lời gọi trong arrow function để nó chỉ chạy khi bấm; remove.bind(null, item.id) cũng được.'),
  q('Why does a form submit handler in React usually start with e.preventDefault()?',
    ['To stop React from re-rendering', 'To stop the browser from reloading the page with a full form submission, so React can handle the data', 'To clear all the inputs', 'To validate the form automatically'],
    1,
    'The default action of a submit event is a page navigation/reload, which would wipe the SPA state.|||Hành động mặc định của sự kiện submit là tải lại / chuyển trang, sẽ xoá sạch state của SPA.'),

  /* — Context (2) — */
  q('What text is rendered?',
    ['darkdark', 'lightdark', 'lightlight', 'An error, because the first ThemeLabel has no Provider'],
    1,
    'A consumer without a Provider above it receives the default value given to createContext; inside the Provider it receives the Provider value.|||Component dùng context mà không có Provider phía trên sẽ nhận giá trị mặc định của createContext; bên trong Provider thì nhận value của Provider.',
    { code: `
const ThemeContext = createContext("light");
function ThemeLabel() {
  const theme = useContext(ThemeContext);
  return <p>{theme}</p>;
}
<>
  <ThemeLabel />
  <ThemeContext.Provider value="dark">
    <ThemeLabel />
  </ThemeContext.Provider>
</>` }),
  q('What problem does the Context API mainly solve?',
    ['Slow network requests', 'Prop drilling: passing the same props through many intermediate components that do not use them', 'Code splitting', 'CSS conflicts'],
    1,
    'Context lets deep components read shared data (theme, logged-in user, cart) directly from a Provider.|||Context cho component nằm sâu đọc thẳng dữ liệu dùng chung (theme, người đăng nhập, giỏ hàng) từ Provider.'),

  /* — Hooks (6) — */
  q('count starts at 0. What is displayed after clicking f once, and then g once?',
    ['3, then 6', '1, then 4', '1, then 2', '3, then 4'],
    1,
    'In f all three calls read the same snapshot count = 0, so the result is 1. In g the updater form c => c + 1 queues three increments: 1 → 4.|||Trong f cả ba lần gọi đều đọc cùng ảnh chụp count = 0 nên ra 1. Trong g dạng hàm c => c + 1 xếp hàng ba lần cộng: 1 → 4.',
    { code: `
const [count, setCount] = useState(0);
const f = () => { setCount(count + 1); setCount(count + 1); setCount(count + 1); };
const g = () => { setCount((c) => c + 1); setCount((c) => c + 1); setCount((c) => c + 1); };` }),
  q('The user clicks "t" twice and then "n" once. How many times has the effect run in total?',
    ['1', '2', '3', '4'],
    1,
    'The effect runs after the first render and again only when n changes; changing t re-renders but does not re-run it.|||Effect chạy sau lần render đầu và chỉ chạy lại khi n đổi; đổi t có render lại nhưng không chạy lại effect.',
    { code: `
const [n, setN] = useState(0);
const [t, setT] = useState("");
useEffect(() => {
  console.log("effect");
}, [n]);` }),
  q('The component renders, re-renders once, then unmounts. What is logged?',
    ['render, effect, render, effect, cleanup', 'render, effect, render, cleanup, effect, cleanup', 'render, render, effect, cleanup', 'effect, render, cleanup, effect'],
    1,
    'Before re-running an effect React calls the previous cleanup, and on unmount it calls the last cleanup.|||Trước khi chạy lại effect React gọi cleanup của lần trước, và khi gỡ component thì gọi cleanup cuối cùng.',
    { code: `
function Timer() {
  console.log("render");
  useEffect(() => {
    console.log("effect");
    return () => console.log("cleanup");
  });
  return null;
}` }),
  q('Which code breaks the Rules of Hooks?',
    ['Calling useState at the top level of a component', 'Calling useEffect inside if (isLoggedIn) { … }', 'Calling a custom hook useFetch inside a component', 'Calling useContext in a custom hook'],
    1,
    'Hooks must be called in the same order on every render, so never inside conditions, loops or nested functions. Put the condition inside the hook instead.|||Hook phải được gọi theo cùng thứ tự ở mọi lần render, nên không đặt trong điều kiện, vòng lặp hay hàm lồng. Đưa điều kiện vào bên trong hook.'),
  q('When is useReducer a better choice than useState?',
    ['When the state is a single boolean', 'When the state has several related fields and many kinds of updates that you want to describe as actions', 'When you need to fetch data', 'When the component has no state'],
    1,
    'useReducer centralises update logic in a pure reducer (state, action) => newState, which is easier to read and test when updates are complex.|||useReducer gom logic cập nhật vào một reducer thuần (state, action) => state mới, dễ đọc và dễ test khi cập nhật phức tạp.'),
  q('Which statement about custom hooks is true?',
    ['Their name must start with "use" and they may call other hooks', 'They must return JSX', 'They share the same state between every component that calls them', 'They can only be used in class components'],
    0,
    'A custom hook is a function named useXxx that reuses stateful logic; every component that calls it gets its own independent state.|||Custom hook là hàm tên useXxx dùng lại logic có state; mỗi component gọi nó có state riêng, độc lập.'),

  /* — Router (5) — */
  q('The URL is /about. What is displayed (React Router v6)?',
    ['Home', 'About', 'HomeAbout', 'Nothing'],
    1,
    'In v6, <Routes> renders only the best match and "/" does not match "/about" because matching is exact by default.|||Ở v6, <Routes> chỉ render route khớp nhất, và "/" không khớp "/about" vì mặc định khớp chính xác.',
    { code: `
<Routes>
  <Route path="/" element={<p>Home</p>} />
  <Route path="/about" element={<p>About</p>} />
</Routes>` }),
  q('Which React Router v6 component replaced <Switch> from v5?',
    ['<Router>', '<Routes>', '<Outlet>', '<Redirect>'],
    1,
    'v6 renamed Switch to Routes and replaced component={X} with element={<X />}; Redirect became <Navigate />.|||v6 đổi Switch thành Routes và thay component={X} bằng element={<X />}; Redirect thành <Navigate />.'),
  q('Why should you use <Link to="/cart"> instead of <a href="/cart"> inside a React Router app?',
    ['Link is styled automatically', 'Link changes the URL without a full page reload, so the app state is kept', 'a tags are forbidden in JSX', 'Link sends a POST request'],
    1,
    'A plain anchor makes the browser request a new document and restarts the SPA; Link updates history and React renders the new route.|||Thẻ a thường khiến trình duyệt tải tài liệu mới và khởi động lại SPA; Link cập nhật lịch sử và React render route mới.'),
  q('What does navigate(-1) do, where navigate comes from useNavigate()?',
    ['Goes to the route with id -1', 'Goes back one entry in the history, like the browser Back button', 'Reloads the current page', 'Throws an error'],
    1,
    'navigate accepts a path or a number delta: -1 goes back, 1 goes forward.|||navigate nhận đường dẫn hoặc một số bước: -1 lùi lại, 1 tiến tới.'),
  q('In a detail page, products are loaded from the API (ids are numbers). Why does find return undefined?',
    ['find only works on strings', 'useParams() returns id as a string ("2"), and "2" === 2 is false', 'The products array is sorted', 'useParams must be awaited'],
    1,
    'Strict equality never matches a string with a number. Compare with p.id === Number(id) or String(p.id) === id.|||So sánh nghiêm ngặt không bao giờ khớp chuỗi với số. Viết p.id === Number(id) hoặc String(p.id) === id.',
    { code: `
const { id } = useParams();   // URL: /products/2
const product = products.find((p) => p.id === id);
// products = [{ id: 1, ... }, { id: 2, ... }]` }),

  /* — lazy & Suspense (3) — */
  q('Which code correctly lazy-loads Settings and shows a fallback while it loads?',
    ['const Settings = lazy("./Settings"); <Settings fallback="Loading" />', 'const Settings = lazy(() => import("./Settings")); <Suspense fallback={<p>Loading...</p>}><Settings /></Suspense>', 'const Settings = import("./Settings"); <Suspense><Settings /></Suspense>', 'const Settings = React.lazy(import("./Settings")); <Loading><Settings /></Loading>'],
    1,
    'lazy takes a function returning a dynamic import, and the lazy component is rendered inside a Suspense boundary that provides the fallback.|||lazy nhận một hàm trả về import động, và component lazy được render bên trong Suspense — nơi cung cấp fallback.'),
  q('When is the Suspense fallback displayed?',
    ['Every time the component re-renders', 'While a lazy child (or other suspending child) is still loading', 'Only when an error occurs', 'Only during server-side rendering'],
    1,
    'The fallback replaces the suspended subtree until it is ready; errors need an Error Boundary instead.|||fallback thay cho cây con đang treo tới khi sẵn sàng; lỗi thì cần Error Boundary.'),
  q('What is the main benefit of code splitting with React.lazy?',
    ['It removes the need for a bundler', 'A smaller initial bundle, so the first page loads faster; other code is downloaded when needed', 'It makes every component render faster', 'It caches API responses'],
    1,
    'Splitting defers code the user may never visit, improving the first load time.|||Tách code giúp hoãn tải phần người dùng có thể không bao giờ mở, nên lần tải đầu nhanh hơn.'),

  /* — Client-server (5) — */
  q('What is the total printed?',
    ['15', '25', '35', 'NaN'],
    2,
    'reduce starts from 0 and adds price × qty for each line: 10×2 + 5×3 = 35. Forgetting the initial value 0 is a common bug with arrays of objects.|||reduce bắt đầu từ 0 và cộng giá × số lượng từng dòng: 10×2 + 5×3 = 35. Quên giá trị khởi đầu 0 là lỗi hay gặp với mảng object.',
    { code: `
const cart = [{ price: 10, qty: 2 }, { price: 5, qty: 3 }];
console.log(cart.reduce((sum, i) => sum + i.price * i.qty, 0));` }),
  q('Which statement about axios compared with fetch is true?',
    ['axios cannot send POST requests', 'axios parses JSON automatically into response.data and rejects on non-2xx statuses; with fetch you call res.json() and check res.ok yourself', 'fetch must be installed with npm', 'axios only works in Node.js'],
    1,
    'These two differences explain most PE bugs: forgetting res.json() with fetch, or reading res.json instead of res.data with axios.|||Hai khác biệt này giải thích phần lớn lỗi PE: quên res.json() với fetch, hoặc đọc res.json thay vì res.data với axios.'),
  q('What does the HTTP status code 500 indicate?',
    ['The resource was not found', 'The client is not authenticated', 'An internal error happened on the server', 'The request succeeded'],
    2,
    '4xx codes are client errors (400 bad request, 401 unauthenticated, 403 forbidden, 404 not found); 5xx codes are server errors.|||Mã 4xx là lỗi phía client (400 sai yêu cầu, 401 chưa xác thực, 403 bị cấm, 404 không tìm thấy); mã 5xx là lỗi phía server.'),
  q('Which request follows REST conventions to delete product 5?',
    ['GET /deleteProduct?id=5', 'POST /products/delete/5', 'DELETE /products/5', 'PUT /products/5 with { "deleted": true }'],
    2,
    'REST uses nouns for resources (/products/5) and HTTP methods for the action: GET read, POST create, PUT/PATCH update, DELETE remove.|||REST dùng danh từ cho tài nguyên (/products/5) và phương thức HTTP cho hành động: GET đọc, POST tạo, PUT/PATCH sửa, DELETE xoá.'),
  q('Which code handles a failed request correctly with async/await?',
    ['const data = await axios.get(url).data;', 'try { const res = await axios.get(url); setData(res.data); } catch (err) { setError(err.message); }', 'axios.get(url).await(); setData();', 'const res = axios.get(url); if (res.error) setError(res.error);'],
    1,
    'An awaited promise that rejects throws, so the error is handled with try/catch. Note await axios.get(url).data reads .data from the promise, not from the response.|||Promise bị reject khi await sẽ ném lỗi, nên xử lý bằng try/catch. Chú ý await axios.get(url).data là đọc .data của promise chứ không phải của response.'),

  /* — Redux (4) — */
  q('What is the purpose of middleware such as redux-thunk in a Redux application?',
    ['To style components', 'To sit between dispatch and the reducer, so you can run side effects such as API calls or logging before an action reaches the reducer', 'To replace reducers', 'To store state in localStorage automatically'],
    1,
    'Middleware wraps dispatch. Thunk lets you dispatch a function that performs async work and then dispatches plain actions.|||Middleware bọc quanh dispatch. Thunk cho phép dispatch một hàm làm việc bất đồng bộ rồi dispatch action thường.'),
  q('What is store.getState().counter.value after both dispatches?',
    ['5', '3', '8', '{ type: "counter/incrementByAmount", payload: 3 }'],
    2,
    'Each dispatch runs the reducer with action.payload: 0 + 5 + 3 = 8. The reducer is mounted under the key counter in configureStore.|||Mỗi lần dispatch chạy reducer với action.payload: 0 + 5 + 3 = 8. Reducer gắn dưới khoá counter trong configureStore.',
    { code: `
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    incrementByAmount: (state, action) => { state.value += action.payload; },
  },
});
const store = configureStore({ reducer: { counter: counterSlice.reducer } });
store.dispatch(counterSlice.actions.incrementByAmount(5));
store.dispatch(counterSlice.actions.incrementByAmount(3));` }),
  q('Which of the following must NOT be done inside a Redux reducer?',
    ['Returning a new state object', 'Reading action.payload', 'Calling an API or Math.random()', 'Using a switch on action.type'],
    2,
    'Reducers must be pure: the same state and action always give the same result, with no side effects. Async work belongs in thunks.|||Reducer phải thuần: cùng state và action luôn cho cùng kết quả, không có side effect. Việc bất đồng bộ đặt trong thunk.'),
  q('(Choose 2 answers) Which hooks from react-redux connect a function component to the store?',
    ['useSelector', 'useDispatch', 'useReducer', 'useStore("cart")'],
    0,
    'useSelector reads data and subscribes to changes; useDispatch returns dispatch to send actions. useReducer is React local state, not Redux.|||useSelector đọc dữ liệu và theo dõi thay đổi; useDispatch trả về dispatch để gửi action. useReducer là state cục bộ của React, không phải Redux.',
    { correctIndexes: [0, 1] }),

  /* — Next.js (2) — */
  q('Which command creates a new Next.js project?',
    ['npm install next-app', 'npx create-next-app@latest my-app', 'npm create react-app --next', 'next init my-app'],
    1,
    'create-next-app scaffolds the project and asks about TypeScript, ESLint, Tailwind and the App Router.|||create-next-app dựng khung dự án và hỏi có dùng TypeScript, ESLint, Tailwind và App Router không.'),
  q('How does server-side rendering in Next.js mainly benefit a public website?',
    ['It removes the need for JavaScript', 'The browser and search engines receive ready HTML, improving SEO and the first paint', 'It makes state management unnecessary', 'It reduces the size of images'],
    1,
    'With SSR/SSG the HTML already contains the content, so crawlers can index it and users see the page before the JavaScript finishes loading (then hydration makes it interactive).|||Với SSR/SSG, HTML đã chứa nội dung nên máy tìm kiếm đọc được và người dùng thấy trang trước khi JavaScript tải xong (sau đó hydration làm trang tương tác được).'),
];

export default { ch9, ch10, ch11, ch12, a1, a2, a3, tongHop };
