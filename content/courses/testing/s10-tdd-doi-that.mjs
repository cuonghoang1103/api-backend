/**
 * Testing — Chương 10: TDD và testing trong đội thật (soạn chi tiết 01/11/2026).
 * 10.1 tdd · 10.2 code-cu · 10.3 review · 10.4 phong-van (slug giữ từ khung) · Lab 10 (MỚI) · Quiz Chương 10 (MỚI).
 * Code/output ở ./s10/_ma.mjs — sinh bằng scripts/tst/sinh-ma.mjs từ labflow-lite chạy thật (Vitest 5.0.5, Stryker 10.1.1, Node 22.23.3):
 * TDD danh sách chờ BR-09 qua 7 bước (demo10/tdd), classicist vs mockist (demo10/truong-phai), báo cáo LabFlow v0 + characterization test
 * (demo10/legacy, demo10/dac-ta), PR #57 trước/sau review (demo10/review, nhánh git trong bản scratch), mergeBusy code trực tiếp (demo10/phong-van),
 * Lab 10 (lab10/, scripts/dot-bien-10.mjs). TIÊU ĐỀ CHƯƠNG giữ như khung.
 */
import tdd from './s10/tdd.mjs';
import codeCu from './s10/code-cu.mjs';
import review from './s10/review.mjs';
import phongVan from './s10/phong-van.mjs';
import lab from './s10/lab.mjs';
import quiz from './s10/quiz.mjs';

export default {
  title: 'Chapter 10 — TDD and testing in real teams|||Chương 10 — TDD và testing trong đội thật',
  description: 'Testing như khi đi làm trong một đội thật, mọi bước đều chạy thật trên LabFlow Lite: TDD làm thật — danh sách chờ BR-09 qua bảy bước đỏ → xanh → refactor, mỗi lần đỏ có output, Stryker diệt 45/45 đột biến của kết quả, classicist vs mockist (refactor vô hại làm test mockist đỏ, bug repository để nó xanh) và khi nào TDD không hợp; thêm test cho code cũ theo Michael Feathers — báo cáo LabFlow v0 dính CSDL, mạng và đồng hồ, seam, characterization test và golden master (một mẫu 96% dòng mà chỉ bắt 3/10 thay đổi, đủ nhánh thì 10/10), refactor dưới test, bẫy múi giờ; review test trong pull request — sáu mùi đo bằng số (test chính mock, snapshot quá rộng, tên "should", dữ liệu ngẫu nhiên đỏ 10/30, kiểm cài đặt, retry che lỗi thành 0/30), bộ nộp đúng 2/5 còn bộ đã review 5/5; câu hỏi phỏng vấn testing trả lời bằng số đo của cả khoá và một vòng code trực tiếp 20 phút (bộ yếu 0/6, bộ mẫu 6/6); rồi Lab 10: một tính năng viết test trước, một module cũ được ghim rồi refactor, máy chấm 8 đột biến (bộ yếu 1/8, lời giải 8/8).',
  lessons: [tdd, codeCu, review, phongVan, lab, quiz],
};
