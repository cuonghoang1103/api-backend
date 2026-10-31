# Liên kết chéo FER202 (Academy) ↔ khoá React (Courses)

Đợt mẫu 31/10/2026. Deep link mở đúng bài: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (trang học dùng chung; `/academy/courses/<slug>/learn?...` chuyển hướng về đúng URL này, giữ query).
- Academy: slug khoá `front-end-web-development-with-react`
- Courses: slug khoá `react`

Khối HTML: `<a class="link-card lien-ket-cheo" ...>` (kiểu link-card sẵn có, CSS ở globals.css `.rich-content .link-card`), đặt cuối khối `ml-vi` và cuối khối `ml-en` của từng bài.
Bài FER202 dạng bài tập (`fer202-1-ex2-first-app`, dựng bằng bi() trong fer202/ch1.mjs) chưa chèn khối phía Academy (chỉ Courses trỏ về).

| FER202 (Academy) | react (Courses) | Giống | Courses sâu thêm |
|---|---|---|---|
| `fer202-1-1-fullstack-react` | `rx-0-8-bat-dau-tai-day` | cả hai mở đầu bằng câu hỏi "React giải quyết vấn đề gì" | mười hai mốc ra đời kiểm được, so sánh React với Vue/Angular/Svelte và lý do công ty vẫn chọn React |
| `fer202-1-ex2-first-app` | `rx-0-1-cai-dat` | cùng mục tiêu: có một dự án React chạy được trên máy | đo thật so với Create React App, đọc cấu trúc dự án, sự khác nhau giữa vite build và tsc -b, dọn template và thêm Vitest |
| `fer202-2-1-es6-basics` | `rx-0-3-js-cho-react` | biến, hàm mũi tên và template literal | so sánh theo tham chiếu, map/filter/find/reduce, truthy/falsy, ?. và ??, closure, Promise và async/await — chạy trên danh sách bác sĩ |
| `fer202-2-2-destructuring-spread-modules` | `rx-0-3-js-cho-react` | destructuring, spread và import/export | spread chép rồi sửa nghĩa là gì, cùng giá trị hay cùng object, closure, async/await |
| `fer202-3-1-jsx-basics` | `rx-0-2-jsx` | nhúng biểu thức bằng { }, điều kiện, render danh sách | bốn luật JSX kèm lỗi sẽ gặp, ba mẫu render có điều kiện, đọc lớp phủ lỗi của Vite |
| `fer202-5-1-components-props` | `rx-1-1-component` | function component và cách ghép component | vì sao không định nghĩa component bên trong component khác, React có thể gọi hàm nhiều lần, và đọc được class component cũ |
| `fer202-5-1-components-props` | `rx-1-2-props` | props chỉ đọc và truyền dữ liệu từ cha xuống con | interface và giá trị mặc định, children, số 0 hiện lên màn hình, .sort() đảo luôn mảng của cha |
| `fer202-5-2-state-class-vs-function` | `rx-2-1-use-state` | useState và vì sao cập nhật theo hàm tránh được bẫy "+2" | "render" thật sự là gì, state là ảnh chụp, batching nhiều lần set một lần render, luật của hook |
| `fer202-6-1-events-forms` | `rx-2-2-su-kien` | truyền hàm xử lý, truyền tham số, preventDefault | đưa cho React một hàm — đừng gọi nó, ba cách viết handler, sự kiện nổi bọt, form tải lại trang |
| `fer202-6-1-events-forms` | `rx-3-1-controlled` | controlled input: value + onChange | useRef, đọc FormData lúc gửi, hai cảnh báo React hay ném ra, nhiều ô một object một handler |
| `fer202-7-1-context` | `rx-5-1-context` | prop drilling và Context ba bước: tạo, cung cấp, đọc | cơn bão render đo thật, tách context đổi thường xuyên khỏi context ít đổi, khi nào Context là đủ |
| `fer202-7-2-render-props` | `rx-13-1-compound-headless` | cùng mục tiêu: component dùng lại được mà không phải thêm một prop cho mỗi mong muốn | compound component, headless hook (hành vi không kèm giao diện), bàn phím và ARIA cho tab |
| `fer202-8-1-usestate-useeffect` | `rx-4-1-use-effect` | effect chạy sau render và mảng dependency | ba dạng mảng dependency, cleanup chạy trước lần setup kế tiếp, vì sao Strict Mode chạy effect hai lần; các bài sau còn "bạn có thể không cần effect", vòng lặp vô hạn, stale closure |
| `fer202-8-2-usecontext-usereducer` | `rx-5-2-reducer` | reducer, action và so sánh useState với useReducer | union hành động, reducer thuần, luồng đặt lịch bốn bước, "đếm luật chứ đừng đếm số biến"; tiếp theo là Zustand và state trên URL |
| `fer202-9-1-router` | `rx-7-1-router` | khai báo route, tham số route, Link và điều hướng bằng code | test route không cần trình duyệt, F5 ở trang con (máy chủ phải biết đường lui); tiếp theo là layout, route lồng nhau, trang cần đăng nhập, cấu trúc dự án và đường sang Next.js |
| `fer202-10-1-lazy-suspense` | `rx-8-3-lazy` | React.lazy, Suspense và chia theo route | cái bẫy barrel file kéo thư viện về lại file đầu, route lười đổi gì trong test, tải lười ảnh, khi nào không nên chia |
| `fer202-11-1-fetch-async` | `rx-6-1-fetch` | fetch trong useEffect rồi lưu vào state | fetch không ném lỗi với 404, cuộc đua giữa hai request đo trong Chromium thật, AbortController, API giả bằng MSW |
| `fer202-11-2-axios-json-server` | `rx-6-2-tanstack` | cùng chủ đề: lấy dữ liệu từ máy chủ về cho component | useQuery, query key là địa chỉ trong cache, staleTime/gcTime, status khác fetchStatus; tiếp theo là mutation và cập nhật lạc quan |

Chưa cặp (không liên quan đủ): Mục 0/2 Academy (điều kiện qua môn…), Ch4 Bootstrap, Ch1.2 Git/npm, 3.2 Fragments, Ch1-11 quiz/chữa quiz. Courses còn ch9 test, ch10-12, ch14 chưa có đối ứng Academy.
