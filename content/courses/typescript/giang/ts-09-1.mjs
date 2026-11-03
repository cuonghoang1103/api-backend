/** Giảng theo slide — bài 9.1 What tsc does & tsconfig basics (deck ts-09-1, 8 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-09-1', 'What tsc does &amp; tsconfig basics', 'tsc làm gì &amp; tsconfig căn bản', [
  [1, 'What tsc does &amp; tsconfig basics',
    `<p>For eight chapters you have written types; this chapter is about the tool that checks them and the file that configures it. tsc reads your code, checks the types, and — in this course — emits nothing (Node runs the .ts files itself). What it checks, and what it quietly does not, is decided by tsconfig.json.</p>`,
    `<p>Tám chương bạn đã viết kiểu; chương này nói về công cụ kiểm chúng và tệp cấu hình nó. tsc đọc code, kiểm kiểu, và — trong khoá này — không sinh ra gì (Node tự chạy tệp .ts). Nó kiểm gì, và âm thầm không kiểm gì, là do tsconfig.json quyết định.</p>`],
  [2, 'What you will take away from this chapter',
    `<p>By the end you can read a tsconfig and know what each flag buys: strict and its family (9.2), the extra safety flags beyond strict (9.3), and target, lib, module and noEmit (9.4). And you will see the most important gap of all: tsc only checks the files in your project — a drifted file left outside is invisible, which is exactly how a renamed enum once broke the seed on production.</p>`,
    `<p>Cuối chương bạn đọc được một tsconfig và biết mỗi cờ mua gì: strict và họ hàng của nó (9.2), các cờ an toàn thêm ngoài strict (9.3), và target, lib, module, noEmit (9.4). Và bạn sẽ thấy lỗ hổng quan trọng nhất: tsc chỉ kiểm các tệp trong dự án — một tệp đã trôi để ngoài là vô hình, đúng cách một enum bị đổi tên từng làm vỡ seed trên production.</p>`],
  [3, 'Types are erased — see it',
    `<p>area takes a Rect and returns a number; Node runs it and prints 12. The types were gone before the code ran — Node strips them. So the types never protect you at run time; their entire job is the check tsc runs beforehand. That is why the check, and its configuration, matter.</p>`,
    `<p>area nhận một Rect và trả một number; Node chạy và in 12. Các kiểu đã biến mất trước khi code chạy — Node bỏ chúng. Nên kiểu không bao giờ bảo vệ bạn lúc chạy; toàn bộ việc của chúng là phép kiểm tsc chạy trước đó. Vì thế phép kiểm, và cấu hình của nó, mới quan trọng.</p>`],
  [4, 'tsconfig.json: the control panel',
    `<p>tsconfig.json is where you set what tsc does: target and lib (which JavaScript it assumes), module (how imports resolve), strict (how strict the checks are), noEmit (check only, produce nothing), and include (which files are the project). The course config is small and strict; the rest of the chapter is each line of it.</p>`,
    `<p>tsconfig.json là nơi bạn đặt tsc làm gì: target và lib (giả định JavaScript nào), module (import phân giải ra sao), strict (kiểm chặt đến đâu), noEmit (chỉ kiểm, không sinh gì), và include (những tệp nào là dự án). Config của khoá nhỏ và strict; phần còn lại của chương là từng dòng của nó.</p>`],
  [5, 'The gap: tsc only checks the project',
    `<p>Here is a project whose tsconfig includes only src. The seed/ folder holds a file that still uses the renamed value 'CODE' — a real bug. Run tsc and it reports 0 errors, because seed/ is outside include: the compiler never looked at it. A clean build does not mean a correct codebase; it means the files you pointed at are correct.</p>`,
    `<p>Đây là một dự án mà tsconfig chỉ include src. Thư mục seed/ chứa một tệp còn dùng giá trị đã đổi tên 'CODE' — một bug thật. Chạy tsc và nó báo 0 lỗi, vì seed/ nằm ngoài include: trình biên dịch không hề nhìn nó. Một build sạch không có nghĩa là mã nguồn đúng; nó có nghĩa là các tệp bạn trỏ tới đúng.</p>`],
  [6, 'Close the gap: a second config',
    `<p>Point a config at the seed too and the drift surfaces: TS2322, 'CODE' is not assignable to ContentType. This is exactly the 2026-08-08 incident — a renamed enum passed every check because seed.ts was excluded (and carried a hand-copied union). The fix is a second typecheck config that includes the seed, run in CI. A gap you do not check for is a gap that ships.</p>`,
    `<p>Trỏ một config vào cả seed và chỗ trôi lộ ra: TS2322, 'CODE' không gán được cho ContentType. Đây đúng sự cố 08/08/2026 — một enum đổi tên qua mọi phép kiểm vì seed.ts bị loại (và mang một union chép tay). Cách sửa là một config typecheck thứ hai include seed, chạy trong CI. Một lỗ hổng bạn không kiểm là một lỗ hổng lên sản phẩm.</p>`],
  [7, 'What tsc does, in one picture',
    `<p>tsc takes the files in include, checks their types against the flags in tsconfig, and reports errors; with noEmit it stops there. It does not run your code, it does not freeze anything at run time, and it does not look at a single file outside the project. Knowing those boundaries is knowing what your green check actually proves.</p>`,
    `<p>tsc lấy các tệp trong include, kiểm kiểu của chúng theo các cờ trong tsconfig, và báo lỗi; với noEmit nó dừng ở đó. Nó không chạy code, không đóng băng gì lúc chạy, và không nhìn một tệp nào ngoài dự án. Biết các ranh giới đó là biết dấu xanh của bạn thật sự chứng minh điều gì.</p>`],
  [8, 'Practice &amp; what is next',
    `<p>Practice: a project with a seed that holds a dead value compiles clean because the seed is excluded — add a config that includes it and watch the drift become a compile error. Next, 9.2: the strict flag — the single switch that turns on the checks that caught most of the bugs in this course.</p>`,
    `<p>Luyện tập: một dự án với một seed giữ một giá trị chết biên dịch sạch vì seed bị loại — thêm một config include nó và nhìn chỗ trôi thành một lỗi biên dịch. Tiếp, 9.2: cờ strict — một công tắc bật các phép kiểm đã bắt phần lớn bug trong khoá này.</p>`],
]);
