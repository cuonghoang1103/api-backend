/** Giảng theo slide — bài 8.3 Record (deck ts-08-3, 7 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-08-3', 'Record', 'Record', [
  [1, 'Record',
    `<p>Record builds a table: Record of Keys and V is an object with one entry of type V for every key. You met it as a mapped type in 7.1; here it is the everyday tool for a lookup — labels for statuses, seats per lab, a config keyed by name. Its value comes from two very different modes, depending on whether the keys are a closed union or open strings.</p>`,
    `<p>Record dựng một bảng: Record của Keys và V là một object với một mục kiểu V cho mỗi khoá. Bạn đã gặp nó như một mapped type ở 7.1; ở đây nó là công cụ hằng ngày cho một bảng tra — nhãn cho trạng thái, số chỗ mỗi lab, một config tra theo tên. Giá trị của nó đến từ hai chế độ rất khác, tuỳ khoá là một union đóng hay chuỗi mở.</p>`],
  [2, 'A table that must be complete',
    `<p>With a union of keys, Record of LabCode and number demands an entry for every lab — and reading seats of a known code is a plain number, no undefined. This is the closed table of 4.4 and 5.4, now named: the keys are finite, so the compiler can require all of them.</p>`,
    `<p>Với một union khoá, Record của LabCode và number đòi một mục cho mỗi lab — và đọc seats của một mã đã biết là một number thuần, không undefined. Đây là bảng đóng của 4.4 và 5.4, giờ có tên: các khoá hữu hạn, nên trình biên dịch đòi được đủ.</p>`],
  [3, 'Leave one out and it is an error',
    `<p>Drop a lab from the literal and it is TS2741: the table must cover every key in the union. This is the guarantee you want for a status-label map or a translation table — the compiler will not let you forget a case, the same safety as the exhaustive switch in 5.4, from the data side.</p>`,
    `<p>Bỏ một lab khỏi literal và nó là TS2741: bảng phải phủ mọi khoá trong union. Đây là bảo đảm bạn muốn cho một bản đồ nhãn trạng thái hay một bảng dịch — trình biên dịch không cho bạn quên một trường hợp, cùng độ an toàn như switch vét cạn ở 5.4, từ phía dữ liệu.</p>`],
  [4, 'The open mode: string keys',
    `<p>With Record of string and number the keys are open — any string — so a lookup may be missing. Under noUncheckedIndexedAccess the compiler types cache of a key as number or undefined, which is honest: a dictionary you did not build cannot promise a key exists. Guard with ?? and it reads cleanly.</p>`,
    `<p>Với Record của string và number các khoá mở — chuỗi bất kỳ — nên một lần tra có thể thiếu. Dưới noUncheckedIndexedAccess trình biên dịch gán kiểu cache của một khoá là number hoặc undefined, điều đó trung thực: một từ điển bạn không tự dựng không hứa được một khoá tồn tại. Chặn bằng ?? thì đọc gọn.</p>`],
  [5, 'The open mode refuses an unchecked read',
    `<p>Use an open lookup as a number without a guard and it is TS2322 — number or undefined is not a number. This is the same noUncheckedIndexedAccess rule from 4.4, and it is the price of an open table: the completeness a closed Record gives you for free, you earn with a guard here.</p>`,
    `<p>Dùng một lần tra mở như một number mà không chặn và nó là TS2322 — number hoặc undefined không phải một number. Đây cùng luật noUncheckedIndexedAccess của 4.4, và là cái giá của một bảng mở: tính đầy đủ mà một Record đóng cho bạn miễn phí, ở đây bạn phải trả bằng một guard.</p>`],
  [6, 'Closed or open, choose on purpose',
    `<p>A Record over a union is a complete table the compiler checks; a Record over string is an open dictionary where every read may miss. Reach for the union form whenever the keys are known — a status, a lab code, a locale — so a missing entry is a compile error, not a runtime undefined.</p>`,
    `<p>Một Record trên một union là một bảng đầy đủ trình biên dịch kiểm; một Record trên string là một từ điển mở nơi mỗi lần đọc có thể trượt. Dùng dạng union mỗi khi các khoá đã biết — một trạng thái, một mã lab, một locale — để một mục thiếu là một lỗi biên dịch, không phải một undefined lúc chạy.</p>`],
  [7, 'Practice &amp; what is next',
    `<p>Practice: a label map typed as a plain object forgot CANCELLED and silently returns the raw code at run time — make it Record of Status and string so the missing label is a compile error. Next, 8.4: the utilities that filter unions (Exclude, NonNullable) and read types out of functions (ReturnType, Parameters, Awaited).</p>`,
    `<p>Luyện tập: một bản đồ nhãn kiểu object thường quên CANCELLED và âm thầm trả mã thô lúc chạy — làm nó Record của Status và string để nhãn thiếu là một lỗi biên dịch. Tiếp, 8.4: các utility lọc union (Exclude, NonNullable) và đọc kiểu ra từ hàm (ReturnType, Parameters, Awaited).</p>`],
]);
