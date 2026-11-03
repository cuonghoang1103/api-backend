/** Giảng theo slide — bài 14.2 Inheritance, abstract & implements (deck ts-14-2, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-14-2', 'Inheritance, abstract & implements', 'Kế thừa, abstract & implements', [
  [1, 'Inheritance, abstract & implements',
    `<p>An abstract class names the shape a subclass must fill in — some methods are written, others are left as <code>abstract</code> for the subclass to provide. <code>implements</code> is the other half: it checks that a class matches an interface. Both turn “a subclass must have this method” into a compile error if it does not.</p>`,
    `<p>Một abstract class đặt tên dáng mà lớp con phải điền — một số method được viết, số khác để <code>abstract</code> cho lớp con cung cấp. <code>implements</code> là nửa kia: nó kiểm một class khớp một interface. Cả hai biến “một lớp con phải có method này” thành một lỗi biên dịch nếu nó không có.</p>`],
  [2, 'An abstract class names the shape',
    `<p><code>BookingRepo</code> is abstract: it writes <code>describe()</code> in terms of an abstract <code>find()</code> the subclass must supply. A <code>MemoryRepo</code> extends it and implements <code>find</code>; you use it through the <code>BookingRepo</code> type. The base defines the contract, the subclass fills it in.</p>`,
    `<p><code>BookingRepo</code> là abstract: nó viết <code>describe()</code> dựa trên một <code>find()</code> abstract mà lớp con phải cung cấp. Một <code>MemoryRepo</code> kế thừa nó và cài <code>find</code>; bạn dùng nó qua kiểu <code>BookingRepo</code>. Lớp nền định nghĩa hợp đồng, lớp con điền nó.</p>`],
  [3, 'An abstract class cannot be instantiated',
    `<p>Write <code>new BookingRepo()</code> and it is TS2511 — an abstract class has holes (the abstract methods), so it cannot be built directly. You instantiate a concrete subclass that filled those holes. The type still works as a parameter or field type; it just cannot be constructed.</p>`,
    `<p>Viết <code>new BookingRepo()</code> và nó là TS2511 — một abstract class có lỗ (các method abstract), nên không dựng trực tiếp được. Bạn dựng một lớp con cụ thể đã lấp các lỗ đó. Kiểu vẫn dùng được làm kiểu tham số hay field; chỉ là không dựng được.</p>`],
  [4, 'implements checks a class against an interface',
    `<p>A class that says <code>implements Repo</code> but is missing a method is TS2420 — it claimed to satisfy the interface and does not. <code>implements</code> is a promise the compiler checks: add a method to the interface and every implementer that has not caught up lights up. A non-abstract subclass missing an inherited abstract member is the related TS2654/TS2515.</p>`,
    `<p>Một class nói <code>implements Repo</code> nhưng thiếu một method là TS2420 — nó tuyên bố thoả interface mà không. <code>implements</code> là một lời hứa trình biên dịch kiểm: thêm một method vào interface và mọi bên cài chưa theo kịp sáng lên. Một lớp con non-abstract thiếu một thành viên abstract kế thừa là TS2654/TS2515 liên quan.</p>`],
  [5, 'At a glance',
    `<p>An <code>abstract</code> class mixes written methods with abstract ones a subclass must supply; instantiating it is TS2511. <code>implements Interface</code> checks a class structurally; a missing method is TS2420. Together they encode “this must be provided” as a compile error, not a run-time gap.</p>`,
    `<p>Một <code>abstract</code> class trộn method đã viết với method abstract lớp con phải cung cấp; dựng nó là TS2511. <code>implements Interface</code> kiểm một class về cấu trúc; một method thiếu là TS2420. Cùng nhau chúng mã hoá “cái này phải được cung cấp” thành một lỗi biên dịch, không phải một khe hở lúc chạy.</p>`],
  [6, 'Practice & what is next',
    `<p>Practice: a concrete <code>SeatStore extends Store</code> forgot the abstract <code>get</code> — TS2515; implement it and it runs. Next, 14.3: <code>#private</code> is a field the language itself hides at run time, stronger than the compile-time <code>private</code>.</p>`,
    `<p>Luyện tập: một <code>SeatStore extends Store</code> cụ thể quên <code>get</code> abstract — TS2515; cài nó và nó chạy. Tiếp, 14.3: <code>#private</code> là một trường chính ngôn ngữ giấu lúc chạy, mạnh hơn <code>private</code> lúc biên dịch.</p>`],
]);
