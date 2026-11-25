/**
 * Testing — Chương 10B: Postman và Newman (BÀI MỚI 24/11/2026, agent pmn — bảng khoảng trống 20/11, P1).
 * Chèn giữa Chương 10 và Chương 11 (dự án cuối khoá + bài thi) — KHÔNG đổi tiêu đề Ch10/Ch11 (seeder neo chương bằng tiêu đề).
 * 10B.1 collection-bien · 10B.2 test-script · 10B.3 xac-thuc · 10B.4 du-lieu · 10B.5 newman-ci · 10B.6 mock-cong-cu · Lab 10B · Quiz 10B.
 * Mọi output trong ./s10b/_ma.mjs — sinh bằng scratchpad/pmn/sinh-ma.mjs từ lab chạy thật (newman 6.2.3, Node 22.22,
 * API LabFlow Lite Ch5 + postman/server.js trong container pmn-api). Chưa có deck slide (chưa đẩy R2) ⇒ bài không có phần "📑 Học theo slide".
 */
import collectionBien from './s10b/collection-bien.mjs';
import testScript from './s10b/test-script.mjs';
import xacThuc from './s10b/xac-thuc.mjs';
import duLieu from './s10b/du-lieu.mjs';
import newmanCi from './s10b/newman-ci.mjs';
import mockCongCu from './s10b/mock-cong-cu.mjs';
import lab from './s10b/lab.mjs';
import quiz from './s10b/quiz.mjs';

export default {
  title: 'Chapter 10B — API tests with Postman and Newman|||Chương 10B — Test API bằng Postman và Newman',
  description: 'Cùng API LabFlow Lite của Chương 5, lần này test từ BÊN NGOÀI mã: collection, environment và năm tầng biến; test script với pm.test và Chai cùng 7 bẫy cho test xanh giả; JWT hết hạn, OAuth 2.0 client credentials và token giả mạo; test hướng dữ liệu bằng CSV/JSON cho mọi giá trị biên; Newman trong GitHub Actions với báo cáo JUnit (và báo cáo HTML làm lộ mật khẩu); mock server từ OpenAPI; so với Bruno, REST Client và HTTPie; rồi một lab có máy chấm cài 8 bug vào API.',
  lessons: [collectionBien, testScript, xacThuc, duLieu, newmanCi, mockCongCu, lab, quiz],
};
