/** Giảng theo slide — Lab 6 "Review bảo mật" (deck api-lab-6, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-lab-6', "Lab 6 — Security review", "Lab 6 — Review bảo mật", [
  [1, "Cover",
    `<p>Lab 6: you receive a LabFlow build with LABFLOW_VULN=1 and do the job of a real reviewer: find the holes, prove them, close them and leave tests behind.</p>`,
    `<p>Lab 6: bạn nhận một bản LabFlow chạy LABFLOW_VULN=1 và làm đúng việc của người review thật: tìm lỗ, chứng minh, vá, và để lại bộ test.</p>`],
  [2, "What is switched on",
    `<p>Five holes are open: the receipt skips the object check, the verifier accepts alg none and ignores expiry with no login limit, PATCH me copies the whole body, safeFetch fetches anything and follows redirects, and CORS reflects any origin with credentials. Work only on your own laptop.</p>`,
    `<p>Năm lỗ đang mở: biên nhận bỏ qua kiểm đối tượng, bộ kiểm token nhận alg none và bỏ qua hạn dùng, không giới hạn đăng nhập, PATCH me chép nguyên body, safeFetch tải mọi thứ và đi theo chuyển hướng, và CORS phản chiếu mọi origin kèm credentials. Chỉ làm trên máy của chính bạn.</p>`],
  [3, "Part A and B",
    `<p>Part A: run the audit, write one curl exploit per failure with real output, explain why API5 and API6 fail too, and rate impact and ease. Part B: close every hole with the techniques of lessons 6.1 to 6.4 and write a security test file.</p>`,
    `<p>Phần A: chạy bộ kiểm, viết cho mỗi lỗi một lệnh curl khai thác kèm output thật, giải thích vì sao API5 và API6 cũng trượt, và chấm mức ảnh hưởng và độ dễ. Phần B: đóng mọi lỗ bằng kỹ thuật của bài 6.1 đến 6.4 và viết một tệp test bảo mật.</p>`],
  [4, "Reference solution",
    `<p>Each security test must pass on the fixed build and fail with LABFLOW_VULN=1; a test that passes on both tests nothing. The full file is in the lesson.</p>`,
    `<p>Mỗi test bảo mật phải đạt trên bản đã vá và trượt khi bật LABFLOW_VULN=1; test nào đạt cả hai bên là không kiểm gì cả. Tệp đầy đủ nằm trong bài.</p>`],
  [5, "Part C",
    `<p>The real transcript: nine failures and the escalation on the vulnerable build; zero wrong cells, a clean audit and ten of ten tests on the fixed one; five red security tests when the holes are switched back on. Run the matrix before the audit, because the audit locks Bin’s login on purpose.</p>`,
    `<p>Bản ghi thật: chín lần trượt và vụ tự nâng quyền trên bản lỗi; không ô sai nào, bộ kiểm sạch và mười trên mười test trên bản đã vá; năm test bảo mật đỏ khi bật lại lỗ. Chạy ma trận trước bộ kiểm, vì bộ kiểm cố ý khoá đăng nhập của Bình.</p>`],
  [6, "Rubric",
    `<p>Ten points: findings and the chain, BOLA, tokens and login limit, mass assignment, SSRF and CORS, tests green and red, and an honest transcript. Pass at seven.</p>`,
    `<p>Mười điểm: phát hiện và chuỗi lỗi, BOLA, token và giới hạn đăng nhập, gán hàng loạt, SSRF và CORS, test xanh và đỏ, và bản ghi trung thực. Đạt từ bảy điểm.</p>`],
]);
