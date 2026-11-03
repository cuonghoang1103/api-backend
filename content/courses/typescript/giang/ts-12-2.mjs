/** Giảng theo slide — bài 12.2 Typing hooks (deck ts-12-2, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-12-2', 'Typing hooks', 'Gõ kiểu hooks', [
  [1, 'Typing hooks',
    `<p>Hooks are generic functions, so they are typed like everything from Chapter 6. Most of the time inference does the work; you pass a type argument only when the initial value cannot tell the whole story — above all when the state starts null.</p>`,
    `<p>Hook là các hàm generic, nên chúng được gõ kiểu như mọi thứ ở Chương 6. Đa số thời gian suy kiểu làm việc; bạn chỉ truyền một đối số kiểu khi giá trị khởi đầu không kể hết câu chuyện — nhất là khi state khởi đầu bằng null.</p>`],
  [2, 'useState infers, and the setter is checked too',
    `<p>useState(0) infers number from the initial value, and — this is the point — the setter is typed to match. setCount(count + 1) is fine; a wrong type is refused. State and its updater cannot drift apart, because they come from one generic call.</p>`,
    `<p>useState(0) suy ra number từ giá trị đầu, và — đây là điểm mấu chốt — setter được gõ kiểu khớp theo. setCount(count + 1) thì được; một sai kiểu bị từ chối. State và bộ cập nhật của nó không thể trôi lệch nhau, vì chúng đến từ một lời gọi generic.</p>`],
  [3, 'The setter refuses the wrong type',
    `<p>setCount("three") on a number state is TS2345 — the setter’s parameter is number. The payoff is that the state can never be set to something the rest of the component is not prepared to read, and the error is at the call, not three renders later.</p>`,
    `<p>setCount("three") trên một state number là TS2345 — tham số của setter là number. Phần thưởng là state không bao giờ bị đặt thành thứ mà phần còn lại của component chưa sẵn sàng đọc, và lỗi ở ngay chỗ gọi, không phải ba lần render sau.</p>`],
  [4, 'Nullable state & refs force the loading branch',
    `<p>When state starts null, write the generic — useState&lt;User | null&gt;(null) — or inference locks it to null forever. Read .name without checking and it is TS18047 "possibly null". A ref is the same: useRef&lt;T&gt;(null) gives a .current of T | null, because the DOM node does not exist until React attaches it — so you narrow, or use optional chaining.</p>`,
    `<p>Khi state khởi đầu null, hãy viết generic — useState&lt;User | null&gt;(null) — không thì suy kiểu khoá nó thành null mãi mãi. Đọc .name mà không kiểm là TS18047 "possibly null". Một ref cũng vậy: useRef&lt;T&gt;(null) cho một .current là T | null, vì nút DOM chưa tồn tại tới khi React gắn nó — nên bạn thu hẹp, hoặc dùng optional chaining.</p>`],
  [5, 'At a glance — and the stale-closure trap',
    `<p>useState usually infers; a null start needs the annotation; a ref’s .current is always T | null. The trap: setCount(count + 1) twice in one handler increments once — both read the same count from that render’s closure. The types cannot see it. Use setCount(c =&gt; c + 1) when the next value depends on the previous one.</p>`,
    `<p>useState thường tự suy; một khởi đầu null cần chú thích; .current của ref luôn là T | null. Bẫy: setCount(count + 1) hai lần trong một handler chỉ tăng một — cả hai đọc cùng một count từ closure của lần render đó. Kiểu không thấy được. Hãy dùng setCount(c =&gt; c + 1) khi giá trị kế phụ thuộc giá trị trước.</p>`],
  [6, 'Practice & what is next',
    `<p>Practice: a number state with setSeats("forty") is TS2345; pass a number and it runs. Next, 12.3: events — e.target.value is a typed string, the same lesson as Express params, now on the DOM.</p>`,
    `<p>Luyện tập: một state number với setSeats("forty") là TS2345; truyền một số và nó chạy. Tiếp, 12.3: sự kiện — e.target.value là một string có kiểu, cùng bài học với params Express, giờ trên DOM.</p>`],
]);
