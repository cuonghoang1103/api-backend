/**
 * FER202 · Chương 15 — Interview corner: câu GV hỏi khi bảo vệ assignment CodeLearn, kèm câu trả lời mẫu (EN|||VI).
 */
import { doiDau, lc, phongVan } from './_chung.mjs';

// đáp án đúng xoay vòng vị trí a → d (không để mọi câu cùng là "b")
const VI_TRI = [1, 3, 0, 2, 2, 0, 3, 1, 0, 2, 1, 3, 3, 1, 0];
let thu = 0;
const q = (ma, de, luaChon, dapAn, en, vi) => {
  const dung = luaChon.find(([m]) => m === dapAn[0]);
  const sai = luaChon.filter(([m]) => m !== dapAn[0]);
  const viTri = VI_TRI[thu++ % VI_TRI.length];
  const xep = [...sai.slice(0, viTri), dung, ...sai.slice(viTri)].map(([, noiDung], i) => ['abcd'[i], noiDung]);
  return { ma, de, luaChon: lc(...xep), dapAn: ['abcd'[viTri]], giaiThich: `<b>Model answer:</b> "${en}"|||<b>Trả lời mẫu:</b> "${vi}"` };
};

export default doiDau(phongVan({
  slug: 'fer202-15-interview-codelearn',
  chuong: 15,
  chuDe: 'CodeLearn assignment defence',
  baiHoc: 'fer202-12-1-redux-toolkit',
  cauHoi: [
    q('d1', 'Walk me through what happens when a student clicks "Enroll now".',
      [['a', 'The button writes to db.json directly.'], ['b', 'onClick dispatches the enrollCourse thunk → enrollApi checks GET /enrollments?userId&courseId, then POST /enrollments through axiosClient → json-server saves it → fulfilled reducer adds it to state → the selector returns the enrolment → the box re-renders as "Go to course".'], ['c', 'The page reloads and reads localStorage.'], ['d', 'React Router stores the enrolment in the URL.']], ['b'],
      'The click dispatches enrollCourse. The thunk first asks the server whether this user already has that course, then posts a new row through the api layer. json-server writes db.json and returns the row; the fulfilled case puts it into the enrollments slice; selectEnrollmentByCourse now finds it, so the component re-renders with Go to course and a success message.',
      'Cú bấm dispatch enrollCourse. Thunk hỏi máy chủ người này đã có khoá chưa, rồi POST một dòng mới qua tầng api. json-server ghi db.json và trả dòng đó; case fulfilled thêm vào slice enrollments; selectEnrollmentByCourse tìm thấy nên component render lại thành "Go to course" kèm thông báo thành công.'),
    q('d2', 'Why Redux Toolkit here and not only useState / Context?',
      [['a', 'Redux is required by React.'], ['b', 'Auth, courses, enrolments and quiz state are shared by many distant pages and loaded asynchronously; slices + createAsyncThunk give one source of truth with a standard loading/error lifecycle, devtools and selectors. Page-only admin data stays in component state.'], ['c', 'Context cannot hold objects.'], ['d', 'Redux makes the app faster in every case.']], ['b'],
      'The user, the catalogue, my enrolments and quiz attempts are read by the navbar, several pages and guards. Putting them in slices gives one source of truth, and createAsyncThunk gives every request the same pending / fulfilled / rejected lifecycle. Data used by one admin page only stays local — I did not put everything into Redux.',
      'User, danh mục, lượt ghi danh và lượt làm quiz được navbar, nhiều trang và lớp chặn route cùng đọc. Đưa vào slice thì có một nguồn sự thật, và createAsyncThunk cho mọi request cùng vòng đời pending / fulfilled / rejected. Dữ liệu chỉ một trang admin dùng thì để cục bộ — em không nhét mọi thứ vào Redux.'),
    q('d3', 'How are the admin pages protected, and is that real security?',
      [['a', 'Hiding the Admin link is enough.'], ['b', 'ProtectedRoute with role="admin" wraps the /admin route tree: guest ⇒ Navigate to /login with state.from, student ⇒ 403. It protects the UI only — json-server has no auth, so a real API must check a token and the role on every request.'], ['c', 'The admin password is checked on every render.'], ['d', 'React Router encrypts the route.']], ['b'],
      'All admin routes are children of one route wrapped in ProtectedRoute role="admin". No user: Navigate to /login and remember the page; wrong role: a 403 block. Typing the URL is covered, not only the link. But this is front-end protection only: anyone can call json-server directly. A real back end must verify a token and the role on each request.',
      'Mọi route admin là con của một route bọc ProtectedRoute role="admin". Chưa đăng nhập: Navigate về /login và nhớ trang định vào; sai vai trò: khối 403. Gõ thẳng URL cũng bị chặn, không chỉ ẩn link. Nhưng đây chỉ là chặn ở giao diện: ai cũng gọi thẳng json-server được. Back end thật phải kiểm token và vai trò ở mọi request.'),
    q('d4', 'Why did you pin json-server to 0.17.4?',
      [['a', 'It is the newest version.'], ['b', 'Version 1.x removed _expand and _embed (and changed filters/pagination); the app uses _embed=lessons for the curriculum and _expand=course / _expand=chapter for My Courses and the quiz history.'], ['c', 'Because 0.17.4 supports authentication.'], ['d', 'No reason.']], ['b'],
      'json-server 1.x dropped _expand and _embed. My curriculum uses chapters with _embed=lessons, My Courses uses _expand=course and the quiz history uses _expand=chapter, so I pinned 0.17.4 in package.json — without the caret, so npm install cannot upgrade it.',
      'json-server 1.x bỏ _expand và _embed. Chương trình học của em dùng chapters với _embed=lessons, My Courses dùng _expand=course, lịch sử quiz dùng _expand=chapter, nên em ghim 0.17.4 trong package.json — không có dấu ^ để npm install không tự nâng.'),
    q('d5', 'Where is lesson progress stored, and why not in localStorage?',
      [['a', 'In localStorage, it is faster.'], ['b', 'In enrollments.completedLessons on the server, updated with PATCH. It survives reloads and other devices, and My Courses / My Progress / statistics all read the same data. localStorage is per browser and the admin could never see it.'], ['c', 'In the URL.'], ['d', 'In a global variable.']], ['b'],
      'Progress is the completedLessons array of the enrolment on the server. Mark complete sends a PATCH with a new sorted array. Because it is server data, it survives a reload or another laptop, and every screen — learn page, My Courses, My Progress, admin stats — derives its numbers from the same place.',
      'Tiến độ là mảng completedLessons của lượt ghi danh trên máy chủ. Đánh dấu hoàn thành gửi PATCH một mảng mới đã sắp. Vì là dữ liệu máy chủ nên tải lại hay đổi máy vẫn còn, và mọi màn — trang học, My Courses, My Progress, thống kê admin — đều suy ra số từ cùng một chỗ.'),
    q('d6', 'Your quiz is graded in the browser. What is the weakness?',
      [['a', 'None.'], ['b', 'json-server sends answerIndex to the client, so anyone can read the answers in DevTools and POST a fake 100% result. A real back end keeps answers on the server, receives only the chosen options and computes and stores the score itself.'], ['c', 'The browser cannot do maths.'], ['d', 'Radio buttons are insecure.']], ['b'],
      'Because json-server has no logic, the questions arrive with answerIndex and the score is computed client-side, then posted. A student could read the answers in the Network tab or post percent: 100. In production the API would hide answerIndex, accept only the chosen options and grade on the server.',
      'Vì json-server không có logic nên câu hỏi về kèm answerIndex, điểm tính ở client rồi mới POST. Học viên có thể đọc đáp án ở tab Network hoặc POST percent: 100. Làm thật thì API giấu answerIndex, chỉ nhận phương án đã chọn và chấm ở máy chủ.'),
    q('d7', 'Why must the variable be called REACT_APP_API_URL, and why did changing .env "not work"?',
      [['a', 'Any name works.'], ['b', 'Create React App only exposes variables starting with REACT_APP_ and inlines them at start/build time, so after editing .env you must restart npm start. Keeping the URL there means one place to change between environments.'], ['c', 'Because .env is read on every request.'], ['d', 'Because axios requires that name.']], ['b'],
      'CRA embeds environment variables into the bundle when the dev server starts, and only those prefixed REACT_APP_. So a change needs a restart. The URL lives only in .env and axiosClient, which means no component hard-codes localhost:9999.',
      'CRA nhúng biến môi trường vào bundle lúc khởi động dev server, và chỉ nhận biến có tiền tố REACT_APP_. Sửa .env thì phải chạy lại. URL chỉ nằm ở .env và axiosClient nên không component nào viết cứng localhost:9999.'),
    q('d8', 'Why keep the course filters in the URL instead of useState?',
      [['a', 'useState cannot hold strings.'], ['b', 'The URL is the single source of truth: the filtered list can be bookmarked, shared and refreshed, and Back/Forward work. The visible list is derived with useMemo from the loaded courses + useSearchParams.'], ['c', 'It is faster.'], ['d', 'React Router requires it.']], ['b'],
      'With useSearchParams the filters, search, sort and page are part of the address, so /courses?category=1&level=Intermediate opens already filtered, can be shared, and Back restores the previous filter. I never store the filtered list; it is computed from the Redux list and the URL in useMemo.',
      'Dùng useSearchParams thì bộ lọc, ô tìm, sắp xếp, trang là một phần địa chỉ, nên /courses?category=1&level=Intermediate mở ra đã lọc, chia sẻ được, và Back trả lại bộ lọc trước. Em không lưu danh sách đã lọc; nó được tính từ danh sách Redux và URL trong useMemo.'),
    q('d9', 'A student double-clicks "Enroll now". What happens in your app?',
      [['a', 'Two enrolments are created.'], ['b', 'Only one: the thunk\'s condition option skips the second dispatch while the first is pending, the button is disabled, and the thunk checks the server for an existing enrolment before posting.'], ['c', 'The app crashes.'], ['d', 'The browser blocks double clicks.']], ['b'],
      'Only one row is created. There are three layers: createAsyncThunk has a condition that refuses to start while enrollStatus is loading, the button is disabled during the request, and the thunk asks GET /enrollments?userId&courseId before POST, which also covers two open tabs.',
      'Chỉ một dòng được tạo. Có ba lớp: createAsyncThunk có condition không cho chạy khi enrollStatus đang loading, nút bị khoá trong lúc gửi, và thunk hỏi GET /enrollments?userId&courseId trước khi POST — chặn luôn trường hợp mở hai tab.'),
    q('d10', 'Why PATCH for completedLessons and lock/role, but PUT for a question?',
      [['a', 'They are the same.'], ['b', 'PATCH sends only the changed fields, so it cannot overwrite or drop other fields (and never sends back the _expand-ed course). The question form edits every field, so replacing the whole object with PUT is correct.'], ['c', 'json-server only supports PATCH.'], ['d', 'PUT is faster.']], ['b'],
      'PATCH is a partial update: for progress I send only completedLessons, for a user only active or role. If I PUT the enrolment I loaded with _expand=course, that nested course would be written into db.json. A question form holds the full question, so PUT replaces it as a whole.',
      'PATCH là cập nhật một phần: tiến độ chỉ gửi completedLessons, người dùng chỉ gửi active hoặc role. Nếu PUT lượt ghi danh đã tải bằng _expand=course thì course lồng sẽ bị ghi vào db.json. Form câu hỏi giữ đủ câu hỏi nên PUT thay nguyên bản ghi.'),
    q('d11', 'Why is login handled like this, and what is wrong with it outside a school project?',
      [['a', 'Nothing, it is production ready.'], ['b', 'json-server cannot authenticate, so the app fetches the user by email and compares a plain-text password, then keeps the user (without password) in Redux + localStorage. In production: hashed passwords on the server, a login endpoint returning a token (httpOnly cookie or JWT), and the server checks it.'], ['c', 'Passwords should be stored in localStorage.'], ['d', 'React encrypts the password automatically.']], ['b'],
      'For the assignment I query /users?email= and compare the password in the thunk, and I never save the password in Redux or localStorage. In a real system the password is hashed on the server, the client receives a token, and every API call is checked — the browser never sees other users or passwords.',
      'Trong assignment em gọi /users?email= rồi so mật khẩu trong thunk, và không bao giờ lưu mật khẩu vào Redux hay localStorage. Hệ thống thật thì mật khẩu được băm ở máy chủ, client nhận token, mọi lời gọi API đều được kiểm — trình duyệt không bao giờ thấy người dùng hay mật khẩu khác.'),
    q('d12', 'How do you show loading and error states for API data?',
      [['a', 'With alert().'], ['b', 'Each slice keeps status (idle/loading/succeeded/failed) and error, set by the pending/fulfilled/rejected cases of createAsyncThunk; pages render a spinner, an Alert with Retry, an empty-state message or the data. rejectWithValue carries friendly messages such as "Course not found".'], ['c', 'They are not needed with json-server.'], ['d', 'With try/catch in every component.']], ['b'],
      'Every thunk has the same lifecycle. The slice stores status and error; the page decides: loading shows a spinner, failed shows an Alert with a Retry button, an empty array shows an empty-state message. For expected cases I use rejectWithValue, for example notFound for a draft course, so the UI can show a precise message.',
      'Mọi thunk có cùng vòng đời. Slice lưu status và error; trang quyết định: loading hiện spinner, failed hiện Alert có nút Thử lại, mảng rỗng hiện thông điệp trạng thái rỗng. Trường hợp dự kiến em dùng rejectWithValue, ví dụ notFound cho khoá nháp, để giao diện báo đúng lỗi.'),
    q('d13', '"/courses/1" — why does course.id === id fail in your first version?',
      [['a', 'Because the course does not exist.'], ['b', 'useParams() always returns strings ("1") while json-server ids are numbers (1); compare Number(id) or String(course.id).'], ['c', 'Because of React StrictMode.'], ['d', 'Because ids must be UUIDs.']], ['b'],
      'Route params are strings. The id from useParams is "1" and the id in db.json is the number 1, so strict equality is false. I convert once — Number(courseId) — and the same applies to select values and query parameters such as category.',
      'Tham số route là chuỗi. id từ useParams là "1" còn id trong db.json là số 1, nên so === ra false. Em đổi một lần — Number(courseId) — và áp dụng tương tự cho giá trị select và tham số query như category.'),
    q('d14', 'Why can the admin not lock or delete their own account, and not delete a course with students?',
      [['a', 'No reason, it is a UI choice.'], ['b', 'They are business rules that protect data: locking yourself could leave the system with no admin; deleting a course with enrolments would destroy students\' progress and results — the admin should unpublish it instead.'], ['c', 'json-server does not allow it.'], ['d', 'React forbids it.']], ['b'],
      'Both are business rules. If the only admin locks or demotes themselves, nobody can manage the system any more, so those buttons are disabled on your own row. Deleting a course that students are enrolled in would erase their progress and quiz history, so the thunk checks enrolments first and suggests unpublishing.',
      'Cả hai đều là luật nghiệp vụ. Nếu admin duy nhất tự khoá hay tự hạ quyền thì không ai quản trị được nữa, nên các nút đó bị khoá ở dòng của chính mình. Xoá khoá đang có học viên sẽ xoá sạch tiến độ và lịch sử quiz của họ, nên thunk kiểm lượt ghi danh trước và gợi ý ẩn khoá (unpublish).'),
    q('d15', 'How would you test the statistics page without clicking around?',
      [['a', 'It cannot be tested.'], ['b', 'All maths lives in the pure function computeStats(data) in utils/stats.js, so a unit test can feed it a small data set and compare the result object; the page only renders it.'], ['c', 'Only with screenshots.'], ['d', 'By reading db.json by hand.']], ['b'],
      'I separated calculation from rendering. computeStats takes users, courses, enrolments, results and categories and returns plain numbers and arrays, so a Jest test can pass a tiny data set and check revenue, pass rate, popular order with ties and months. The same idea applies to validators and courseQuery.',
      'Em tách tính toán khỏi hiển thị. computeStats nhận users, courses, enrolments, results, categories và trả số, mảng thuần, nên một test Jest có thể đưa bộ dữ liệu nhỏ và kiểm doanh thu, tỉ lệ đạt, thứ tự khoá phổ biến khi hoà và theo tháng. Ý tưởng này áp dụng cả cho validators và courseQuery.'),
  ],
}));
