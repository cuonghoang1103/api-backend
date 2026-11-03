/** Giảng theo slide — bài 14.3 Native #private, getters & static (deck ts-14-3, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-14-3', 'Native #private, getters & static', '#private thật, getter & static', [
  [1, 'Native #private, getters & static',
    `<p>Chapter 14.1’s <code>private</code> is a compile-time check, erased in the output. <code>#private</code> is different: it is a JavaScript field the language itself hides at run time — no code outside the class can reach it, ever. Add getters for read-only views and <code>static</code> members for class-level constants, and a class controls exactly what the world sees.</p>`,
    `<p><code>private</code> của 14.1 là một phép kiểm lúc biên dịch, bị xoá ở output. <code>#private</code> khác: nó là một trường JavaScript chính ngôn ngữ giấu lúc chạy — không code nào ngoài class với tới được, bao giờ. Thêm getter cho view chỉ-đọc và thành viên <code>static</code> cho hằng cấp-class, và một class kiểm soát đúng cái thế giới thấy.</p>`],
  [2, '#private is enforced at run time',
    `<p>A <code>BookingService</code> with a <code>#count</code>, a <code>get booked()</code> and a <code>static readonly MAX</code> runs: you book, read the count through the getter, and read the constant off the class. The <code>#</code> field is reachable only from inside the class body — not by types alone, but by the language.</p>`,
    `<p>Một <code>BookingService</code> với một <code>#count</code>, một <code>get booked()</code> và một <code>static readonly MAX</code> chạy: bạn book, đọc count qua getter, và đọc hằng từ class. Trường <code>#</code> chỉ với tới được từ trong thân class — không bởi kiểu một mình, mà bởi ngôn ngữ.</p>`],
  [3, '#private cannot be read from outside',
    `<p>Write <code>svc.#count</code> outside the class and it is TS18013. Unlike <code>private</code> (which only the type checker knows), <code>#private</code> is real encapsulation: even plain JavaScript cannot read it, so there is no cast, no bracket trick, no run-time escape. Reach for it when the hidden state must truly stay hidden.</p>`,
    `<p>Viết <code>svc.#count</code> ngoài class và nó là TS18013. Khác <code>private</code> (chỉ bộ kiểm kiểu biết), <code>#private</code> là đóng gói thật: cả JavaScript thuần cũng không đọc được, nên không phép ép, không mẹo ngoặc, không lối thoát lúc chạy. Dùng nó khi trạng thái ẩn phải thật sự ở ẩn.</p>`],
  [4, 'getters and static members',
    `<p>A <code>get booked()</code> exposes a computed, read-only view of the private count — callers read <code>svc.booked</code> like a field but cannot set it. A <code>static readonly MAX</code> belongs to the class, not an instance, so it is a shared constant read as <code>BookingService.MAX</code>. Together they shape the class’s public surface.</p>`,
    `<p>Một <code>get booked()</code> phơi một view chỉ-đọc được tính từ count private — bên gọi đọc <code>svc.booked</code> như một field nhưng không đặt được. Một <code>static readonly MAX</code> thuộc về class, không thuộc một instance, nên nó là một hằng dùng chung đọc là <code>BookingService.MAX</code>. Cùng nhau chúng nắn bề mặt công khai của class.</p>`],
  [5, 'At a glance',
    `<p><code>#private</code> is real run-time encapsulation (reading it outside is TS18013), stronger than compile-time <code>private</code>. A <code>get x()</code> is a read-only computed view; a <code>static</code> member belongs to the class. Prefer <code>#private</code> when the secret must never leak, even to JavaScript.</p>`,
    `<p><code>#private</code> là đóng gói thật lúc chạy (đọc nó ngoài là TS18013), mạnh hơn <code>private</code> lúc biên dịch. Một <code>get x()</code> là một view chỉ-đọc được tính; một thành viên <code>static</code> thuộc về class. Ưu tiên <code>#private</code> khi bí mật không bao giờ được rò, kể cả với JavaScript.</p>`],
  [6, 'Practice & what is next',
    `<p>Practice: a <code>Counter</code> reads its <code>#n</code> from outside — TS18013; read it through the getter and it runs. Next, 14.4: decorators — a function that wraps a method or class, the last class feature and a TC39 standard.</p>`,
    `<p>Luyện tập: một <code>Counter</code> đọc <code>#n</code> của nó từ ngoài — TS18013; đọc nó qua getter và nó chạy. Tiếp, 14.4: decorator — một hàm bọc một method hay class, tính năng class cuối và một chuẩn TC39.</p>`],
]);
