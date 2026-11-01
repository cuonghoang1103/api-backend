/**
 * Testing — Chương 11: Dự án cuối khoá — ứng dụng đặt lịch được test đầy đủ (soạn chi tiết 01/11/2026).
 * 11.1 ke-hoach · 11.2 backend · 11.3 frontend · 11.4 ci (slug giữ từ khung) · 11.5 dự án cuối khoá + máy chấm (MỚI) ·
 * 11.6 bài thi cuối khoá 18 câu (MỚI) · 11.7 học tiếp (MỚI).
 * Code/output ở ./s11/_ma.mjs — sinh bằng scripts/tst/sinh-ma.mjs từ labflow-lite chạy thật (Vitest 5.0.5, Stryker 10.1.1, Playwright 1.64.1,
 * PostgreSQL 17, act 0.2.94, Node 22.23.3): US-11 "My bookings" (huỷ lượt đặt, Lite-3) ở mọi tầng, test-plan/ (kế hoạch + requirements.json),
 * scripts/rtm.mjs (ma trận truy vết), scripts/ma-tran-bat-loi.mjs (12 bug × 5 tầng), scripts/ngan-sach.mjs (ngân sách kim tự tháp),
 * scripts/ci-report.mjs + src/ci/quality.js (báo cáo chất lượng PR), scripts/cham-cuoi-khoa.mjs + capstone/ (máy chấm 100 điểm, bản yếu).
 * TIÊU ĐỀ CHƯƠNG giữ như khung.
 */
import keHoach from './s11/ke-hoach.mjs';
import backend from './s11/backend.mjs';
import frontend from './s11/frontend.mjs';
import ci from './s11/ci.mjs';
import duAn from './s11/du-an.mjs';
import kiemTra from './s11/kiem-tra-cuoi-khoa.mjs';
import hocTiep from './s11/hoc-tiep.mjs';

export default {
  title: 'Chapter 11 — Capstone: a fully tested booking app|||Chương 11 — Dự án cuối khoá: ứng dụng đặt lịch được test đầy đủ',
  description: 'Dự án cuối khoá: thêm một tính năng thật cho LabFlow Lite — US-11 "My bookings", xem và huỷ lượt đặt của mình (huỷ tới 60 phút trước giờ bắt đầu, theo giờ Việt Nam) — và test nó như một đội thật, mọi con số đều đo. Lập kế hoạch test từ rủi ro: phạm vi, bảng rủi ro, 12 bug cài vào được chấm qua 5 tầng (không tầng nào bắt quá 6/12), ngân sách kim tự tháp đo bằng giây, tiêu chí vào/ra, Definition of Done và ma trận truy vết sinh từ báo cáo test thật (tìm ra lỗi LF-301: API không hề kiểm BR-05). Backend: bảng quyết định, Stryker 97,73% ở Hà Nội mà 100% ở UTC, bốn bug chỉ PostgreSQL mới thấy (ngày thành JS Date, ràng buộc loại trừ chặn khung đã huỷ, UPDATE không nguyên tử, id vượt int4), hợp đồng OpenAPI, điểm đột biến 99,08%. Frontend: Testing Library cho màn hình mới, điểm mù của client giả, một hành trình Playwright, và một test cũ thành chập chờn vì trùng mã phòng (bài toán ngày sinh). CI: pipeline đầy đủ với mutation trên mọi PR, ngưỡng nâng dần, một trang báo cáo chất lượng và cổng ci-ok, chạy thật bằng act. Rồi dự án cuối khoá 100 điểm có máy chấm (bản yếu 42/100, bản tham khảo 100/100), cách kể dự án theo STAR trong CV và phỏng vấn, bài thi cuối khoá 18 câu, và lộ trình học tiếp.',
  lessons: [keHoach, backend, frontend, ci, duAn, kiemTra, hocTiep],
};
