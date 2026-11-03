/** Giảng theo slide — bài 14.1 Classes & access modifiers (deck ts-14-1, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-14-1', 'Classes & access modifiers', 'Class & modifier truy cập', [
  [1, 'Classes & access modifiers',
    `<p>A class groups data with the operations on it, and TypeScript adds access modifiers that say who may touch what. <code>private</code> hides a field inside the class, <code>readonly</code> fixes it after construction, <code>protected</code> shares it with subclasses. These are checked at compile time — a boundary the compiler enforces, the start of encapsulation.</p>`,
    `<p>Một class gom dữ liệu với các thao tác trên nó, và TypeScript thêm modifier truy cập nói ai được chạm gì. <code>private</code> giấu một trường trong class, <code>readonly</code> cố định nó sau khi dựng, <code>protected</code> chia nó với lớp con. Chúng được kiểm lúc biên dịch — một ranh giới trình biên dịch ép, khởi đầu của đóng gói.</p>`],
  [2, 'A class groups data and operations',
    `<p>A <code>BookingService</code> holds a private <code>count</code> and a readonly <code>lab</code>, and exposes a <code>book()</code> method. The constructor sets the readonly field; the method changes the private one. From outside you call methods, not fields — the class decides what is visible.</p>`,
    `<p>Một <code>BookingService</code> giữ một <code>count</code> private và một <code>lab</code> readonly, và phơi một method <code>book()</code>. Constructor đặt trường readonly; method đổi trường private. Từ bên ngoài bạn gọi method, không gọi field — class quyết định cái gì nhìn thấy được.</p>`],
  [3, 'private hides internals',
    `<p>Read a <code>private</code> field from outside the class and it is TS2341. The field still exists at run time (TypeScript’s <code>private</code> is a compile-time check, erased in the output), but the compiler refuses the access — so callers depend on the method, not the internal state, and you can change the internals freely.</p>`,
    `<p>Đọc một trường <code>private</code> từ ngoài class và nó là TS2341. Trường vẫn tồn tại lúc chạy (<code>private</code> của TypeScript là một phép kiểm lúc biên dịch, bị xoá ở output), nhưng trình biên dịch từ chối truy cập — nên bên gọi phụ thuộc method, không phụ thuộc trạng thái trong, và bạn đổi phần trong tự do.</p>`],
  [4, 'readonly fixes a field after construction',
    `<p>Reassign a <code>readonly</code> field after the constructor and it is TS2540. The field is set once, when the object is built, and never again — a configuration or an identity that cannot drift. It is the <code>Readonly</code> of Chapter 8, now on a single class field.</p>`,
    `<p>Gán lại một trường <code>readonly</code> sau constructor và nó là TS2540. Trường được đặt một lần, khi object được dựng, và không bao giờ nữa — một cấu hình hay một danh tính không thể trôi. Nó là <code>Readonly</code> của Chương 8, giờ trên một trường class đơn.</p>`],
  [5, 'At a glance',
    `<p><code>private</code> hides a field (reading it outside is TS2341); <code>readonly</code> fixes it after construction (reassigning is TS2540); <code>protected</code> shares with subclasses. These are compile-time boundaries — erased at run time. For a boundary the language enforces at run time too, 14.3 has <code>#private</code>.</p>`,
    `<p><code>private</code> giấu một trường (đọc nó ngoài là TS2341); <code>readonly</code> cố định nó sau construction (gán lại là TS2540); <code>protected</code> chia với lớp con. Chúng là ranh giới lúc biên dịch — bị xoá lúc chạy. Cho một ranh giới ngôn ngữ ép cả lúc chạy, 14.3 có <code>#private</code>.</p>`],
  [6, 'Practice & what is next',
    `<p>Practice: a <code>Lab</code> reads its <code>private seats</code> from outside — TS2341; read it through the method and it runs. Next, 14.2: abstract classes name a shape a subclass must fill in, and <code>implements</code> checks a class against an interface.</p>`,
    `<p>Luyện tập: một <code>Lab</code> đọc <code>private seats</code> của nó từ ngoài — TS2341; đọc nó qua method và nó chạy. Tiếp, 14.2: abstract class đặt tên một dáng mà lớp con phải điền, và <code>implements</code> kiểm một class với một interface.</p>`],
]);
