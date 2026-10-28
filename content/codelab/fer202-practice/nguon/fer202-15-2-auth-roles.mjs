/**
 * CodeLearn · F2 — đăng nhập / đăng ký (json-server users), slice auth + localStorage, route bảo vệ + route admin.
 */
import { doiDau } from './_chung.mjs';
import { DANG_NHAP, banInF, bang, click, cho, dn, gui, moduleF, nhap, taiLai } from './_codelearn.mjs';

const DANG_KY = (ten, email, mk, mk2 = mk) => [cho(200), nhap('#fullName', ten), nhap('#email', email), nhap('#password', mk), nhap('#confirmPassword', mk2), gui('#register-form'), cho(500)];

const MO_TA = {
  en: `<p>Add accounts. Users live in the <code>users</code> collection; json-server is not an auth server, so the app looks the user up by email and compares the password itself (plain text — learning only). The logged-in user (without the password) goes into a Redux <b>auth</b> slice and is persisted in <code>localStorage["codelearn_user"]</code>, so a reload keeps the session. Then guard routes: logged-in only, and admin only.</p>
<h3>API calls</h3>${bang(['Action', 'Request', 'Notes'], [
    ['Log in', '<code>GET /users?email=an@codelearn.vn</code>', 'email trimmed + lower-cased; compare password; <code>active:false</code> ⇒ locked'],
    ['Register: email taken?', '<code>GET /users?email=…</code>', 'non-empty ⇒ "Email is already registered", no POST'],
    ['Register', '<code>POST /users</code> <code>{ fullName, email, password, role:"student", active:true, createdAt }</code>', 'role is set by the app, never by the form'],
  ])}
<h3>Routes after F2</h3>${bang(['Path', 'Access'], [['<code>/login</code>, <code>/register</code>', 'guest (logged in ⇒ redirect away)'], ['<code>/admin</code>', 'admin only: guest ⇒ <code>/login</code> (remember the page), student ⇒ 403 <code>#forbidden</code>']])}
<h3>Edge cases</h3><ul><li>After logging in from a redirect, return to the page the user wanted (<code>location.state.from</code>); otherwise admin ⇒ <code>/admin</code>, student ⇒ <code>/</code>.</li><li>Locked account (<code>cuong@codelearn.vn</code>) cannot log in: "Your account has been locked. Please contact the admin."</li><li>Same message for unknown email and wrong password: "Invalid email or password".</li></ul>`,
  vi: `<p>Thêm tài khoản. Người dùng nằm ở bảng <code>users</code>; json-server không phải máy chủ xác thực nên app tự tìm user theo email rồi so mật khẩu (chữ trần — chỉ để học). Người đã đăng nhập (bỏ mật khẩu) vào slice Redux <b>auth</b> và được lưu ở <code>localStorage["codelearn_user"]</code> ⇒ tải lại trang vẫn còn phiên. Sau đó chặn route: phải đăng nhập, và chỉ admin.</p>
<h3>Lời gọi API</h3>${bang(['Việc', 'Request', 'Ghi chú'], [
    ['Đăng nhập', '<code>GET /users?email=an@codelearn.vn</code>', 'email bỏ khoảng trắng + chữ thường; so mật khẩu; <code>active:false</code> ⇒ bị khoá'],
    ['Đăng ký: email đã có?', '<code>GET /users?email=…</code>', 'có ⇒ "Email is already registered", không POST'],
    ['Đăng ký', '<code>POST /users</code> <code>{ fullName, email, password, role:"student", active:true, createdAt }</code>', 'vai trò do app đặt, không bao giờ lấy từ form'],
  ])}
<h3>Route sau F2</h3>${bang(['Đường dẫn', 'Quyền'], [['<code>/login</code>, <code>/register</code>', 'khách (đã đăng nhập ⇒ chuyển đi)'], ['<code>/admin</code>', 'chỉ admin: khách ⇒ <code>/login</code> (nhớ trang định vào), học viên ⇒ 403 <code>#forbidden</code>']])}
<h3>Trường hợp biên</h3><ul><li>Đăng nhập sau khi bị chuyển hướng ⇒ quay lại trang định vào (<code>location.state.from</code>); không có thì admin ⇒ <code>/admin</code>, học viên ⇒ <code>/</code>.</li><li>Tài khoản bị khoá (<code>cuong@codelearn.vn</code>) không đăng nhập được: "Your account has been locked. Please contact the admin."</li><li>Cùng một thông điệp cho email lạ và sai mật khẩu: "Invalid email or password".</li></ul>`,
};

const BAN_IN = banInF({
  k: 2, phut: 120, moTa: MO_TA, bangDuLieu: ['users'], soDong: 5,
  wireframe: `
/login                                   /register
┌──────────────────────────────┐         ┌──────────────────────────────┐
│ Log in                       │         │ Create your account          │
│ [!] Invalid email or password│ #login-error  │ Full name [________]         │
│ Email    [______________]    │         │ Email     [________]         │
│          Email is required   │ #email-error  │ Password  [________]         │
│ Password [______________]    │         │ Confirm   [________]         │
│ [         Log in         ]   │         │ [        Register        ]   │
│ No account yet? Register     │         │ Already have an account?     │
└──────────────────────────────┘         └──────────────────────────────┘
Navbar (guest):  … Log in  Register        Navbar (logged in):  … [Admin]  Hi, Nguyen Van An  [Log out]`,
  chucNang: [
    { ten: { en: 'Login', vi: 'Đăng nhập' }, diem: 2.5, yeuCau: [
      { en: '<code>/login</code>: <code>#login-form</code> with <code>#email</code>, <code>#password</code>, submit <code>#login-btn</code>; server message in <code>#login-error</code> (Alert).', vi: '<code>/login</code>: <code>#login-form</code> với <code>#email</code>, <code>#password</code>, nút <code>#login-btn</code>; thông điệp máy chủ ở <code>#login-error</code> (Alert).' },
      { en: 'Logged in ⇒ navbar shows <code>#nav-user</code> "Hi, &lt;fullName&gt;" and <code>#logout-btn</code>; admin also sees <code>#nav-admin</code>. Guest sees <code>#nav-login</code>, <code>#nav-register</code>.', vi: 'Đã đăng nhập ⇒ navbar hiện <code>#nav-user</code> "Hi, &lt;fullName&gt;" và <code>#logout-btn</code>; admin thấy thêm <code>#nav-admin</code>. Khách thấy <code>#nav-login</code>, <code>#nav-register</code>.' },
    ], hook: ['createAsyncThunk', 'rejectWithValue', 'useSelector'] },
    { ten: { en: 'Register', vi: 'Đăng ký' }, diem: 2, yeuCau: [
      { en: '<code>/register</code>: <code>#register-form</code> with <code>#fullName</code>, <code>#email</code>, <code>#password</code>, <code>#confirmPassword</code>; duplicate email ⇒ <code>#register-error</code> "Email is already registered". Success ⇒ logged in, go to <code>/</code>.', vi: '<code>/register</code>: <code>#register-form</code> với <code>#fullName</code>, <code>#email</code>, <code>#password</code>, <code>#confirmPassword</code>; email trùng ⇒ <code>#register-error</code> "Email is already registered". Thành công ⇒ đã đăng nhập, về <code>/</code>.' },
    ], viDu: 'register "Le Thi Hoa", Hoa@CodeLearn.vn ⇒ POST /users { email: "hoa@codelearn.vn", role: "student", active: true }' },
    { ten: { en: 'Validation', vi: 'Kiểm dữ liệu' }, diem: 1.5, yeuCau: [
      { en: 'Messages under each field (<code>#&lt;field&gt;-error</code>): "Email is required" · "Email is not valid" · "Password is required" · "Password must be at least 6 characters" · "Full name must be at least 3 characters" · "Passwords do not match". Invalid form ⇒ no API call.', vi: 'Lỗi dưới từng ô (<code>#&lt;tên ô&gt;-error</code>): "Email is required" · "Email is not valid" · "Password is required" · "Password must be at least 6 characters" · "Full name must be at least 3 characters" · "Passwords do not match". Form sai ⇒ không gọi API.' },
    ] },
    { ten: { en: 'Protected & admin routes', vi: 'Route bảo vệ & route admin' }, diem: 2.5, yeuCau: [
      { en: '<code>components/ProtectedRoute.js</code>: guest ⇒ <code>&lt;Navigate to="/login" replace state={{ from: location }} /&gt;</code>; wrong role ⇒ <code>#forbidden</code> "403 — Access denied"; else children / <code>&lt;Outlet /&gt;</code>.', vi: '<code>components/ProtectedRoute.js</code>: khách ⇒ <code>&lt;Navigate to="/login" replace state={{ from: location }} /&gt;</code>; sai vai trò ⇒ <code>#forbidden</code> "403 — Access denied"; còn lại render children / <code>&lt;Outlet /&gt;</code>.' },
      { en: '<code>/admin</code> (placeholder <code>pages/admin/AdminLayout.js</code>, <code>#admin-title</code> "Admin dashboard") is admin only. Logged-in users opening <code>/login</code> are redirected.', vi: '<code>/admin</code> (trang giữ chỗ <code>pages/admin/AdminLayout.js</code>, <code>#admin-title</code> "Admin dashboard") chỉ cho admin. Người đã đăng nhập mở <code>/login</code> bị chuyển đi.' },
    ], hook: ['Navigate', 'useLocation', 'Outlet'] },
    { ten: { en: 'Session in Redux + localStorage', vi: 'Phiên trong Redux + localStorage' }, diem: 1.5, yeuCau: [
      { en: '<code>features/auth/authSlice.js</code>: <code>{ user, status, error }</code>, thunks <code>login</code> / <code>register</code>, action <code>logout</code>; <code>initialState.user</code> read from <code>localStorage["codelearn_user"]</code>; written OUTSIDE the reducer (e.g. <code>store.subscribe</code>); never store the password.', vi: '<code>features/auth/authSlice.js</code>: <code>{ user, status, error }</code>, thunk <code>login</code> / <code>register</code>, action <code>logout</code>; <code>initialState.user</code> đọc từ <code>localStorage["codelearn_user"]</code>; ghi NGOÀI reducer (vd <code>store.subscribe</code>); không bao giờ lưu mật khẩu.' },
    ], khoa: 'codelearn_user', hook: ['createSlice', 'store.subscribe'] },
  ],
  idBatBuoc: [
    ['#login-form #email #password #login-btn #login-error', { en: 'login page', vi: 'trang đăng nhập' }],
    ['#register-form #fullName #email #password #confirmPassword #register-btn #register-error', { en: 'register page', vi: 'trang đăng ký' }],
    ['#email-error #password-error #fullName-error #confirmPassword-error', { en: 'field messages (Form.Control.Feedback)', vi: 'lỗi từng ô (Form.Control.Feedback)' }],
    ['#nav-login #nav-register #nav-user #logout-btn #nav-admin', { en: 'navbar by auth state', vi: 'navbar theo trạng thái đăng nhập' }],
    ['#forbidden · #admin-title', { en: '403 block · admin placeholder', vi: 'khối 403 · trang admin giữ chỗ' }],
  ],
  truDiem: [
    { en: 'Saving the whole user including <code>password</code> in localStorage.', vi: 'Lưu cả user kèm <code>password</code> vào localStorage.' },
    { en: 'Taking <code>role</code> from the register form (anyone can become admin).', vi: 'Lấy <code>role</code> từ form đăng ký (ai cũng thành admin được).' },
    { en: 'Redirecting to /login with <code>window.location</code> (full reload, state lost).', vi: 'Chuyển sang /login bằng <code>window.location</code> (tải lại cả trang, mất state).' },
  ],
});

const ADMIN_DN = DANG_NHAP('admin@codelearn.vn', 'admin123');
const KIEM = [
  // f1 — login
  { nhom: 'f1', moTa: 'Student logs in ⇒ "Hi, Nguyen Van An" + Log out button', url: '/login', kiem: 'danh-sach-text', selector: '#nav-user, #logout-btn', mongDoi: ['Hi, Nguyen Van An', 'Log out'], truoc: DANG_NHAP('an@codelearn.vn', '123456') },
  { nhom: 'f1', moTa: 'Email is matched case-insensitively and trimmed', url: '/login', kiem: 'text', selector: '#nav-user', giaTri: 'Hi, Nguyen Van An', truoc: DANG_NHAP('  AN@CodeLearn.vn ', '123456') },
  { nhom: 'f1', moTa: 'Wrong password ⇒ #login-error "Invalid email or password"', url: '/login', kiem: 'text', selector: '#login-error', giaTri: 'Invalid email or password', truoc: DANG_NHAP('an@codelearn.vn', 'abcdef') },
  { nhom: 'f1', moTa: 'Admin login shows the Admin link', url: '/login', kiem: 'ton-tai', selector: '#nav-admin', truoc: ADMIN_DN },
  { nhom: 'f1', an: true, moTa: 'Locked account cannot log in', url: '/login', kiem: 'text', selector: '#login-error', khop: 'locked', truoc: DANG_NHAP('cuong@codelearn.vn', '123456') },
  { nhom: 'f1', an: true, moTa: 'Guest sees Log in / Register links', url: '/', kiem: 'danh-sach-text', selector: '#nav-login, #nav-register', mongDoi: ['Log in', 'Register'] },
  // f2 — register
  { nhom: 'f2', moTa: 'Register creates a student (lower-case email, role/active set by the app)', url: '/register', kiem: 'du-lieu-server', bang: 'users', chat: true, chua: { fullName: 'Le Thi Hoa', email: 'hoa@codelearn.vn', role: 'student', active: true }, truoc: DANG_KY('Le Thi Hoa', 'Hoa@CodeLearn.vn', 'hoa123') },
  { nhom: 'f2', moTa: 'After registering the new user is logged in', url: '/register', kiem: 'text', selector: '#nav-user', giaTri: 'Hi, Le Thi Hoa', truoc: DANG_KY('Le Thi Hoa', 'hoa@codelearn.vn', 'hoa123') },
  { nhom: 'f2', moTa: 'Duplicate email ⇒ "Email is already registered"', url: '/register', kiem: 'text', selector: '#register-error', giaTri: 'Email is already registered', truoc: DANG_KY('Another An', 'an@codelearn.vn', '654321') },
  { nhom: 'f2', an: true, moTa: 'Duplicate email ⇒ no POST /users', url: '/register', kiem: 'goi-fetch', khop: '^POST .*/users', min: 0, max: 0, truoc: DANG_KY('Another An', 'an@codelearn.vn', '654321') },
  // f3 — validation
  { nhom: 'f3', moTa: 'Empty login ⇒ two field messages', url: '/login', kiem: 'danh-sach-text', selector: '#email-error, #password-error', mongDoi: ['Email is required', 'Password is required'], truoc: [cho(200), gui('#login-form'), cho(200)] },
  { nhom: 'f3', moTa: 'Register: 4 rule messages', url: '/register', kiem: 'danh-sach-text', selector: '#fullName-error, #email-error, #password-error, #confirmPassword-error', mongDoi: ['Full name must be at least 3 characters', 'Email is not valid', 'Password must be at least 6 characters', 'Passwords do not match'], truoc: DANG_KY('Hi', 'abc@', '123', '999') },
  { nhom: 'f3', an: true, moTa: 'Invalid login form ⇒ no API call', url: '/login', kiem: 'goi-fetch', khop: '/users', min: 0, max: 0, truoc: [cho(200), nhap('#email', 'not-an-email'), nhap('#password', '12'), gui('#login-form'), cho(300)] },
  // f4 — protected routes
  { nhom: 'f4', moTa: 'Guest opening /admin ⇒ /login', url: '/admin', kiem: 'duong-dan', giaTri: '/login' },
  { nhom: 'f4', moTa: 'Then logging in as admin returns to /admin', url: '/admin', kiem: 'text', selector: '#admin-title', giaTri: 'Admin dashboard', truoc: ADMIN_DN },
  { nhom: 'f4', moTa: 'Student opening /admin ⇒ 403 #forbidden', url: '/admin', khoCucBo: dn(2), kiem: 'text', selector: '#forbidden', khop: '403' },
  { nhom: 'f4', an: true, moTa: 'Logged-in user opening /login is redirected away', url: '/login', khoCucBo: dn(2), kiem: 'duong-dan', giaTri: '/' },
  { nhom: 'f4', an: true, moTa: 'Admin login without a "from" page goes to /admin', url: '/login', kiem: 'duong-dan', giaTri: '/admin', truoc: ADMIN_DN },
  // f5 — session
  { nhom: 'f5', moTa: 'Session survives a reload (localStorage "codelearn_user")', url: '/login', kiem: 'text', selector: '#nav-user', giaTri: 'Hi, Nguyen Van An', truoc: [...DANG_NHAP('an@codelearn.vn', '123456'), taiLai, cho(300)] },
  { nhom: 'f5', moTa: 'Stored user has the email but NO password', url: '/login', kiem: 'kho-cuc-bo', khoa: 'codelearn_user', khop: '^(?![\\s\\S]*password)[\\s\\S]*"email":"an@codelearn\\.vn"', truoc: DANG_NHAP('an@codelearn.vn', '123456') },
  { nhom: 'f5', moTa: 'Log out clears the session', url: '/', khoCucBo: dn(2), kiem: 'kho-cuc-bo', khoa: 'codelearn_user', tonTai: false, truoc: [cho(200), click('#logout-btn'), cho(200)] },
  { nhom: 'f5', an: true, moTa: 'Auth slice uses createAsyncThunk and does not touch localStorage in reducers', kiem: 'ma-nguon', tep: 'src/features/auth/authSlice.js', khop: '^(?=[\\s\\S]*createAsyncThunk)(?![\\s\\S]*localStorage\\.(setItem|removeItem))' },
];

export default doiDau(moduleF({
  k: 2, phut: 120, banIn: BAN_IN, kiem: KIEM, url: '/login',
  baiHoc: 'fer202-12-1-redux-toolkit',
  khaiNiem: ['createAsyncThunk + rejectWithValue', 'auth slice', 'persist with store.subscribe', 'protected route', 'role-based route (403)', 'Navigate state.from'],
  viDu: [
    { input: 'Guest opens /admin, logs in as admin@codelearn.vn / admin123', output: 'back on /admin — "Admin dashboard"', explanation: 'ProtectedRoute passed the wanted location in state.from; LoginPage navigates there once user is set.|||ProtectedRoute gửi trang định vào qua state.from; LoginPage chuyển về đó khi có user.' },
    { input: 'Student an@codelearn.vn opens /admin', output: '#forbidden — "403 — Access denied"', explanation: 'Logged in but wrong role: 403, not a redirect to /login.|||Đã đăng nhập nhưng sai vai trò: 403, không đá về /login.' },
  ],
  thuatNgu: [{ en: 'authentication / authorization', vi: 'xác thực (bạn là ai) / phân quyền (bạn được làm gì)' }, { en: 'session persistence', vi: 'giữ phiên đăng nhập qua lần tải lại trang' }, { en: '403 Forbidden', vi: 'đã biết bạn là ai nhưng không cho vào' }],
  goiY: [
    'Thứ tự: authApi (findByEmail, create) → authSlice (login/register thunk + logout) → store.js thêm <code>auth</code> → LoginPage/RegisterPage → ProtectedRoute → route trong App.js → navbar.',
    'Trong thunk: <code>const users = await authApi.findByEmail(email.trim().toLowerCase()); const user = users.find(u =&gt; u.password === password); if (!user) return rejectWithValue("Invalid email or password");</code> — reducer <code>rejected</code> đọc <code>action.payload</code>.',
    'Đừng gọi <code>navigate()</code> sau dispatch — dễ "đua" với re-render. Trong LoginPage: <code>if (user) return &lt;Navigate to={location.state?.from?.pathname ?? (user.role === "admin" ? "/admin" : "/")} replace /&gt;</code>. Lưu phiên: <code>store.subscribe(() =&gt; { … localStorage.setItem("codelearn_user", JSON.stringify(user)) })</code> chỉ khi user đổi.',
  ],
  loiHayGap: [
    'Ghi <code>localStorage</code> trong reducer ⇒ reducer không còn thuần (khó test, chạy lại hai lần trong StrictMode). Ghi ở <code>store.subscribe</code> hoặc ở thunk.',
    'Lưu cả object user kèm <code>password</code> vào localStorage — mở DevTools là thấy mật khẩu.',
    'Tìm user bằng <code>GET /users?email=Hoa@CodeLearn.vn</code> trong khi db lưu chữ thường ⇒ json-server so khớp chính xác, không tìm thấy. Luôn <code>trim().toLowerCase()</code> lúc lưu VÀ lúc tìm.',
    'Bảo vệ route bằng cách ẩn link trên navbar ⇒ gõ /admin vẫn vào. Phải chặn ở route (ProtectedRoute).',
    'Chuyển về /login mà không gửi <code>state={{ from: location }}</code> ⇒ đăng nhập xong luôn về trang chủ, người dùng mất trang đang định vào.',
    'Quên reducer <code>rejected</code> ⇒ nút "Log in" quay mãi, không báo lỗi khi json-server chưa chạy.',
  ],
  giaiThich: {
    en: '<p><b>Walkthrough.</b> <code>authApi</code> wraps <code>GET /users?email=</code> and <code>POST /users</code>. The <code>login</code> thunk normalises the email, finds the user, and uses <code>rejectWithValue</code> for the two business failures (wrong credentials, locked) so the reducer can show a friendly message; network errors fall back to a generic one. <code>register</code> checks the email on the server before posting and sets <code>role</code>/<code>active</code> itself. The slice reads the saved user once (<code>initialState</code>), and <code>store.subscribe</code> writes/removes <code>codelearn_user</code> only when the user object changes — reducers stay pure. <code>ProtectedRoute</code> handles both guards: no user ⇒ <code>Navigate</code> to <code>/login</code> with <code>state.from</code>; wrong role ⇒ 403. Login/Register pages redirect by <b>rendering</b> <code>&lt;Navigate&gt;</code> once a user exists, which avoids racing the thunk.</p>',
    vi: '<p><b>Hướng giải.</b> <code>authApi</code> bọc <code>GET /users?email=</code> và <code>POST /users</code>. Thunk <code>login</code> chuẩn hoá email, tìm user, dùng <code>rejectWithValue</code> cho hai lỗi nghiệp vụ (sai thông tin, bị khoá) để reducer hiện thông điệp thân thiện; lỗi mạng rơi về thông điệp chung. <code>register</code> hỏi máy chủ email đã có chưa rồi mới POST, tự đặt <code>role</code>/<code>active</code>. Slice đọc user đã lưu một lần (<code>initialState</code>), <code>store.subscribe</code> ghi/xoá <code>codelearn_user</code> chỉ khi user đổi — reducer giữ thuần. <code>ProtectedRoute</code> lo cả hai lớp chặn: không có user ⇒ <code>Navigate</code> về <code>/login</code> kèm <code>state.from</code>; sai vai trò ⇒ 403. Trang Login/Register chuyển hướng bằng cách <b>render</b> <code>&lt;Navigate&gt;</code> khi đã có user ⇒ không "đua" với thunk.</p>',
  },
}));
