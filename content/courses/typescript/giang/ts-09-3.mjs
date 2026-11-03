/** Giảng theo slide — bài 9.3 Beyond strict: extra safety flags (deck ts-09-3, 7 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-09-3', 'Beyond strict: extra safety flags', 'Vượt strict: các cờ an toàn thêm', [
  [1, 'Beyond strict: extra safety flags',
    `<p>strict is not the end. A handful of flags live outside the umbrella because they are stricter than most projects want by default — but on a codebase you care about, they catch real bugs. Three worth the noise: noUncheckedIndexedAccess, noImplicitReturns and noUnusedLocals. The course config already runs the first.</p>`,
    `<p>strict không phải là hết. Một nhúm cờ nằm ngoài chiếc ô vì chúng chặt hơn mức hầu hết dự án muốn mặc định — nhưng trên một mã nguồn bạn trân trọng, chúng bắt bug thật. Ba cái đáng chịu ồn: noUncheckedIndexedAccess, noImplicitReturns và noUnusedLocals. Config của khoá đã bật cái đầu.</p>`],
  [2, 'noUncheckedIndexedAccess: an access might miss',
    `<p>labs[0] looks safe, but the array could be empty. With noUncheckedIndexedAccess, labs[0] is Lab | undefined, so reading .code is TS18048. It adds undefined to every index and every string-keyed lookup — a little friction for a guarantee that you never read past the end of an array. The course leaves it on for exactly that reason.</p>`,
    `<p>labs[0] trông an toàn, nhưng mảng có thể rỗng. Với noUncheckedIndexedAccess, labs[0] là Lab | undefined, nên đọc .code là TS18048. Nó thêm undefined vào mọi truy cập theo chỉ mục và mọi lần tra khoá chuỗi — một chút ma sát đổi lấy bảo đảm bạn không bao giờ đọc quá cuối mảng. Khoá để nó bật đúng vì lý do đó.</p>`],
  [3, 'noImplicitReturns: every path must return',
    `<p>grade returns on two branches and falls off the end on a third. With noImplicitReturns, that silent undefined is TS7030, not all code paths return a value. It is the flag that catches the forgotten else — the case you thought was impossible but the compiler can reach. Add a return, or make the missing case explicit.</p>`,
    `<p>grade trả về ở hai nhánh và rơi khỏi cuối ở nhánh thứ ba. Với noImplicitReturns, cái undefined âm thầm đó là TS7030, không phải mọi nhánh đều trả về. Đây là cờ bắt cái else bị quên — trường hợp bạn tưởng không thể xảy ra nhưng trình biên dịch tới được. Thêm một return, hoặc làm rõ trường hợp còn thiếu.</p>`],
  [4, 'noUnusedLocals: dead code is an error',
    `<p>count is declared and never read; with noUnusedLocals that is TS6133. A dead local is usually a sign of a half-finished edit — a value you meant to use, a line you forgot to delete. Turning the warning into an error keeps the signal from piling up until nobody reads it. Its sibling noUnusedParameters does the same for arguments.</p>`,
    `<p>count được khai và không bao giờ đọc; với noUnusedLocals đó là TS6133. Một local chết thường là dấu một lần sửa làm dở — một giá trị bạn định dùng, một dòng bạn quên xoá. Biến cảnh báo thành lỗi giữ cho tín hiệu không chất đống tới khi không ai đọc. Người anh em noUnusedParameters làm điều tương tự cho đối số.</p>`],
  [5, 'Beyond strict — when to add each',
    `<p>noUncheckedIndexedAccess whenever you read arrays or maps by key — the biggest payoff, a little friction. noImplicitReturns on any function with branches that compute a value. noUnusedLocals to keep edits clean. None of them is in strict because each adds friction most code can skip; on a long-lived codebase, each pays for it.</p>`,
    `<p>noUncheckedIndexedAccess mỗi khi bạn đọc mảng hay map theo khoá — lợi nhất, một chút ma sát. noImplicitReturns trên mọi hàm có nhánh tính ra một giá trị. noUnusedLocals để giữ các lần sửa gọn. Không cái nào nằm trong strict vì mỗi cái thêm ma sát mà phần lớn code bỏ qua được; trên một mã nguồn sống lâu, mỗi cái đáng giá.</p>`],
  [6, 'The flags beyond strict, at a glance',
    `<p>These are configuration, not syntax — you turn them on in tsconfig and fix what appears, exactly what Lab 9 asks you to do. The lesson of the chapter repeats here: the compiler only protects you against the questions you let it ask, and these flags are three more questions worth asking.</p>`,
    `<p>Đây là cấu hình, không phải cú pháp — bạn bật chúng trong tsconfig và sửa những gì hiện ra, đúng việc Lab 9 yêu cầu. Bài học của chương lặp lại ở đây: trình biên dịch chỉ bảo vệ bạn trước những câu hỏi bạn cho nó hỏi, và các cờ này là ba câu hỏi nữa đáng hỏi.</p>`],
  [7, 'Practice &amp; what is next',
    `<p>Practice: a function that reads names[0] without a guard fails under noUncheckedIndexedAccess — guard it with ?? and it runs. Next, 9.4: the flags that describe the world your code runs in — target, lib and module — and noEmit, the one that makes tsc a pure checker and a CI gate.</p>`,
    `<p>Luyện tập: một hàm đọc names[0] không chặn trượt dưới noUncheckedIndexedAccess — chặn bằng ?? và nó chạy. Tiếp, 9.4: các cờ tả thế giới code bạn chạy trong đó — target, lib và module — và noEmit, cái làm tsc thành một bộ kiểm thuần và một cổng CI.</p>`],
]);
